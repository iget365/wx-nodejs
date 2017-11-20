import { pth } from '../config';
import fs from 'fs';

function readFile(filePath) {
    return fs.readFileSync(filePath).toString();
}
function writeFile(filePath, body) {
    fs.writeFile(filePath, body || '', err => {
        if (err) {
            console.error(err);
        }
    });
}
function readObj(filePath, propName) {
    const body = readFile(filePath);

    if (body) {
        const obj = JSON.parse(body);

        return obj[propName] || '';
    } else {
        return '';
    }
}

function readGlobalAccessToken() {
    return readFile(pth.globalAccessToken);
}
function writeGlobalAccessToken(token) {
    writeFile(pth.globalAccessToken, token);
}

function readOauth(propName) {
    return readObj(pth.oauth, propName);
}
function writeOauth(body) {
    writeFile(pth.oauth, body);
}

function readJsapiTicket() {
    return readFile(pth.jsapiTicket);
}
function writeJsapiTicket(ticket) {
    writeFile(pth.jsapiTicket, ticket);
}

export const token = {
    readGlobalAccessToken,
    writeGlobalAccessToken,
    readOauth,
    writeOauth,
    readJsapiTicket,
    writeJsapiTicket,
};