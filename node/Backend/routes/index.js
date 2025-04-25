let express = require('express')                  
let satellite = require("satellite.js")
let router = express.Router()

//Coordinates for Galway, Ireland
const galwayLat = 53.2709
const galwayLong = -9.0627

//https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json
//https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle


let gnssSatellites = []    //Array to store GNSS satellite data  received  from ESP32

//Fetch satellite data from celestrak (TLE format)
async function fetchCelestrakData() {
  try {
    const response = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle")
    const tleData = await response.text() //fetch the response as text
    
    //Split the TLE data into lines, remove empty lines and extra spaces
    let rows = tleData.split("\n").map(row => row.trim()).filter(row => row.length > 0)
    let mySatellites = []    //Array to store the processed satellites

    //Process data in sets of three lines (Satellite name, tle line 1 and tle line 2)
    for(let i = 0; i < rows.length; i += 3) {
      if(i + 2 < rows.length) {   //Ensure there are three valid lines
        let satName = rows[i]    //First line: satellite name
        let tleLine1 = rows[i + 1]
        let tleLine2 = rows[i + 2]

        try {
          //convert the TLE data to a satellite object
          const satelliteRecord = satellite.twoline2satrec(tleLine1, tleLine2)
          const currentTime = new Date()     //Get current time

          //Calculate satellite's position in Earth-Centered Inertial (ECI) coordinates
          const satPositionVelocity = satellite.propagate(satelliteRecord, currentTime)

          //Check if position data is available
          if(satPositionVelocity.position) {
            const ECIposition = satPositionVelocity.position   //Get satellite position in ECI coordinates
            const gmstTime = satellite.gstime(currentTime)     //Compute Greenwich Mean Sidereal Time
            const geodeticPosition = satellite.eciToGeodetic(ECIposition, gmstTime)  // Convert ECI to latitude/longitude

            const lat = satellite.degreesLat(geodeticPosition.latitude)    // Convert latitude to degrees
            const long = satellite.degreesLong(geodeticPosition.longitude)

            //Check if the satellite is near Galway(within +- degrees latitude/longitude)
            if(Math.abs(lat - galwayLat) < 5 && Math.abs(long - galwayLong) < 5) {
              mySatellites.push({
                name: satName,
                latitude: lat,
                longitude: long,
              })
            } 
          }
        } catch (error) {
          console.log("Error processing satellite:", error)
        }
      }
    }

    return mySatellites
  } catch (error) {
    console.log("Error fetching celestrak data:", error)
    return []  //Return an empty array in case of an error 
  }
}

//API endpoint to receive GNSS satellite data from ESP32
router.post('/api/sendMessage', function (req, res, next) {
  const { satellites } = req.body  // Extract 'satellites' array from request body

  if(satellites) {
    gnssSatellites = satellites //Update global GNSS satellite data
    console.log("Received GNSS satellite data:", gnssSatellites)
    res.status(200).json({ message: "GNSS data received successfully", satellites})
  } else {
    console.log("No GNSS data received")
    res.status(400).json({ error: "No GNSS data received" })
  }
});  

//API endpoint to get both Celestrak and GNSS satellite data
router.get('/', async function (req, res, next) {
  const celestrakSatellites = await fetchCelestrakData()
  res.json({
    celestrakData: celestrakSatellites,   //Processed Celestrak data
    gnssData: gnssSatellites
  })
})

module.exports = router

