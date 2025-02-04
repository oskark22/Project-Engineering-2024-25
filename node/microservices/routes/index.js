let express = require('express');
let router = express.Router();


let numberOfSatellites = 0;

//GET route to serve the integer to the frontend
router.get('/', function (req, res, next) {
  res.json({ satellites: numberOfSatellites });              
  //res.render('index');
});

router.post('/api/sendMessage', function (req, res, next) {
  const { satellites } = req.body;       //Retrieve the integer from ESP32 from the request

  if(satellites) {
    numberOfSatellites = satellites;
    console.log(`Received number of satellites: ${satellites}`);

    
    res.status(200).json({ message: "Satellite count updated", satellites });
  }
  else {
    console.error("No satellites received");
    res.status(400).json({ error: "No satellites received" });
  }
});

module.exports = router;