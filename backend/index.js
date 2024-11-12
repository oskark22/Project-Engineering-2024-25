const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json())

let mesFromESP32 = '';

app.get('/', (req, res) => {
    res.send(`${mesFromESP32}`);
});

app.post('/api/sendMessage', (req, res) => {
    const { message } = req.body; // Retrieve JSON message from the request body

    if(message){
        mesFromESP32 = message;
        console.log("Successful connection to ESP32", message);

        //Send a success response back to ESP32
        res.status(200).json({ message: "Message received successfully", receivedData: message});
    }
    else{
        console.error("No message received");
        res.status(400).json({ error: "No message received" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});