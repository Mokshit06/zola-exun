const express = require('express');
const morgan = require('morgan');

const app = express();

app.get('/', (req, res) => {
  res.send('HEllo world');
});

module.exports = app;
