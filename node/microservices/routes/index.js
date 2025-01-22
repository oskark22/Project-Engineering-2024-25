let express = require('express');
let router = express.Router();


let mesFromESP32 = '';

router.get('/', function (req, res, next) {
  res.send(`${mesFromESP32}`);              //Send response back to ESP32
  //res.render('index');
});

router.post('/api/sendMessage', function (req, res, next) {
  const { message } = req.body;       //Retrieve JSON message sent from ESP32 from the request body

  if(message) {
    mesFromESP32 = message;
    console.log("Successful connection to ESP32", message);

    //Send a success message back to ESP32
    res.status(200).json({ message: "Message received successfully", receivedData: message });
  }
  else {
    console.error("No message received");
    res.status(400).json({ error: "No message received" });
  }
});

module.exports = router;