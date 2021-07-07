const express = require('express');
const fs = require('fs');

const rawConstants = fs.readFileSync('constants.json');
const constants = JSON.parse(rawConstants.toString());

const app = express();

app.get('*', (req, res) => {
  res.send('Hello, World');
});

app.listen(8080);
