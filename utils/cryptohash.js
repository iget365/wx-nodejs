import crypto from 'crypto';

function hash(algorithm, data) {
  return crypto.createHash(algorithm).update(data).digest('hex');
}

function md5(data) {
  return hash('md5', data);
}

function sha1(data) {
  return hash('sha1', data);
}

export const cryptohash = {
  md5,
  sha1,
};