require("babel-register");

const { cryptohash } = require('./utils');
const str = process.argv[2] || '';

if (str) {
  console.log(cryptohash.md5(str));
} else {
  console.log('invalid input arguments.');
}