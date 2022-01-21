const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post("/github", (req, res) => {
     console.log(req.headers);
     res.status(200).send();

     if(typeof req.body.ref !== 'string') return res.status(200).send();
     else if (req.body.ref !== "refs/heads/production") return res.status(200).send();

     var hmac = crypto.createHmac('sha256', process.env.GITHUB_SECRET);

     var data = hmac.update(req.body);

     var gen_hmac = data.digest('hex');

     if(gen_hmac !== req.headers["X-Hub-Signature-256"]) return res.status(403).send("Invalid secret key!");

     exec("cd ../VigorXRAPI; git pull", (error, stdout, stderr) => {
     if (error) {
          console.log(`error: ${error.message}`);
          return;
     }
     if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
     }
     console.log(`stdout: ${stdout}`);
     });
});

app.get("/health", (req, res) => {
     res.status(200).send();
});

app.listen(PORT, '0.0.0.0', () => console.log("Alive on 3001."));