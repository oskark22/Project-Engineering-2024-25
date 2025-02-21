let express = require('express');
let router = express.Router();


let numberOfSatellites = 0;
let satData = [];

//GET route to serve the integer to the frontend
router.get('/', function (req, res, next) {
  res.json({ satellites: satData });              
  //res.render('index');
});

router.post('/api/sendMessage', function (req, res, next) {
  const { satellites } = req.body;       //Retrieve the integer from ESP32 from the request

  if(satellites) {
    satData = satellites;
    console.log("Received satellite data:", satData);

    
    res.status(200).json({ message: "Satellite Data received successfully", satellites });
  }
  else {
    console.error("No satellite data received");
    res.status(400).json({ error: "No satellite data received" });
  }
});

module.exports = router;