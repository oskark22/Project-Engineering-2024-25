let express = require('express')              // express is a Node.js web server framework            
let satellite = require("satellite.js")       // Import satellite.js for satellite tracking calculations
let router = express.Router()                 // Mini express app that can handle routes

//Coordinates for Galway, Ireland
const galwayLat = 53.2709                     // 53.2709 degrees north of the Equator. Latitude measures how far north or south you are from the Equator (which is 0°). Positive values = Northern Hemisphere.
const galwayLong = -9.0627                    // 9.0627 degrees west of the Prime Meridian. (longitude 0° at Greenwich, England). Negative values = Western Hemisphere.


let gnssSatellites = []    //Array to store GNSS satellite data  received  from ESP32

//Fetch satellite data from celestrak (TLE format)
async function fetchCelestrakData() {
  try {
    const response = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle")
    const tleData = await response.text() //fetch the response as text
    
    //Split the TLE data into lines, remove empty lines and extra spaces
    let rows = tleData.split("\n").map(row => row.trim()).filter(row => row.length > 0)
    let mySatellites = []    //Array to store the processed satellites

    //Process data in sets of three lines (Satellite name, tle line 1 and tle line 2). Every 3 lines are processed as one satellite. 
    for(let i = 0; i < rows.length; i += 3) {
      if(i + 2 < rows.length) {       //Ensure there are three valid lines
        let satName = rows[i]         //First line: satellite name
        let tleLine1 = rows[i + 1]    // orbital parameters (inclination, eccentricity, etc).
        let tleLine2 = rows[i + 2]    // velocity & position data.

        try {
          //convert the TLE data to a satellite object
          const satelliteRecord = satellite.twoline2satrec(tleLine1, tleLine2)                // use twoline2satrec to convert TLE into a JSON object
          const currentTime = new Date()     //Get current time

          //Calculate satellite's position in Earth-Centered Inertial (ECI) coordinates. Compute the satellite's position & velocity at currentTime
          const satPositionVelocity = satellite.propagate(satelliteRecord, currentTime)

          //Check if position data is available
          if(satPositionVelocity.position) {
            const ECIposition = satPositionVelocity.position   //Get satellite position in ECI coordinates
            const gmstTime = satellite.gstime(currentTime)     //Compute Greenwich Mean Sidereal Time to see how much Earth has rotated. GMST measures how much the Earth has rotated relative to the stars. Needed for converting ECI coordinates into geographic coordinates (latitude and longitude).
            const geodeticPosition = satellite.eciToGeodetic(ECIposition, gmstTime)  // Convert ECI to latitude/longitude

            const lat = satellite.degreesLat(geodeticPosition.latitude)    // Convert latitude to degrees
            const long = satellite.degreesLong(geodeticPosition.longitude)

            //Check if the satellite is near Galway(within +- degrees latitude/longitude). (51.0 - 53.2709) = 2.2709 (less than 5). (-7.5 - (-9.0627)) = 1.5627 (less than 5). (44.0 - 53.2709) = 9.2709 (over 5)
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

