const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello from the Node.js backend!');
});

app.post('/api/sendMessage', (req, res) => {
    const message = req.body; // Retrieve JSON message from the request body
    console.log("Successful connection to ESP32", message);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});