const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post("/github", (req, res) => {
     console.log(req.body);
     res.status(200).send();
});

app.listen(PORT, '0.0.0.0', () => console.log("Alive on 3001."));