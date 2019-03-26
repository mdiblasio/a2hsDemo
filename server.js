// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

app.use(express.static('public'));

// listen for requests :)
// process.env.PORT = 8855;
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});