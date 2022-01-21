const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require("child_process");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.post("/github", (req, res) => {
     console.log(req.body);
     res.status(200).send();

     if(typeof req.body.ref !== 'string') return res.status(200).send();
     else if (req.body.ref !== "refs/heads/production") return res.status(200).send();
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