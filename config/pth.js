const path = require('path');

export const pth = {
  globalAccessToken: path.join(__dirname + '/global-access-token.js'),
  oauth: path.join(__dirname + '/oauth.js'),
  jsapiTicket: path.join(__dirname + '/jsapi-ticket.js'),
  jsapi: path.join(__dirname + '/jsapi.js'),
};