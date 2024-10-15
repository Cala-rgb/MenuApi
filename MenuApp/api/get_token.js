var request = require("request");

const dotenv = require('dotenv').config();

var options = { method: 'POST',
  url: 'https://dev-m6gpcnrtxv3jbetk.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":' + process.env.CLIENT_ID +',"client_secret":' + process.env.CLIENT_SECRET + ',"audience":"http://localhost:3000","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});