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
     
     if(typeof req.body.ref !== 'string') return res.status(200).send();
     else if (req.body.ref !== "refs/heads/main") return res.status(200).send();
     
     var hmac = crypto.createHmac('sha256', process.env.GITHUB_SECRET);
     
     var data = hmac.update(req.body.toString());
     
     var gen_hmac = data.digest('hex');
     
     if("sha256=" + gen_hmac !== req.headers["x-hub-signature-256"]) return res.status(403).send("Invalid secret key!");
     
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
     res.status(200).send();
});

app.get("/health", (req, res) => {
     res.status(200).send();
});

app.listen(PORT, '0.0.0.0', () => console.log("Alive on 3001."));