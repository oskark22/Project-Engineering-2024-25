const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello from the Node.js backend!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});