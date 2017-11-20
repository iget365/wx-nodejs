require("babel-register");

const { refreshOauthAccessToken } = require('./controllers/wx');

refreshOauthAccessToken();