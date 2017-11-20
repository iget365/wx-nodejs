import { wx, jsapi } from '../config';
import { cryptohash } from './cryptohash';
import { token } from './token';

function jsapiFn(url) {
    url = decodeURIComponent(url);

    const appId = wx.appId;
    const jsapi_ticket = token.readJsapiTicket();
    const { timestamp, noncestr } = jsapi;
    const sorted = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    const signature = cryptohash.sha1(sorted);

    return { appId, timestamp, noncestr, signature };
}

export const signature = {
    jsapi: jsapiFn
};