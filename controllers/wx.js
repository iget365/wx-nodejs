import fs from 'fs';
import querystring from 'querystring';
import { wx, pth, menu } from '../config';
import { cryptohash, token, signature } from '../utils';
import request from '../modules/request';//todo errcode for request

const OAUTH_BASE = Symbol('snsapi_base');
const OAUTH_USERINFO = Symbol('snsapi_userinfo');

function createTextXML(xmlObj, content) {
    const createTime = (+new Date()) / 1000;
    const xml = `<xml>
                  <ToUserName><![CDATA[${xmlObj.FromUserName}]]></ToUserName>
                  <FromUserName><![CDATA[${xmlObj.ToUserName}]]></FromUserName>
                  <CreateTime>${createTime}</CreateTime>
                  <MsgType><![CDATA[text]]></MsgType>
                  <Content><![CDATA[${content || xmlObj.Content}]]></Content>
              </xml>`;

    return xml;
}

function replyXML(xmlObj) {
    let xml = '';

    if (xmlObj) {
        if (xmlObj.MsgType.indexOf('text') !== -1) {
            xml = createTextXML(xmlObj);
        } else {
            xml = createTextXML(xmlObj, '暂不支持该类型的消息');
        }
    }

    return xml;
}

function check(ctx) {
    const query = ctx.query;
    const signature = query.signature || '';
    const timestamp = query.timestamp || '';
    const nonce = query.nonce || '';
    const echostr = query.echostr || '';
    const sortedArr = [wx.token, timestamp, nonce].sort();
    const sortedStr = sortedArr.join('');
    const sha1Str = cryptohash.sha1(sortedStr);

    if (signature === sha1Str) {
        ctx.body = echostr;
        console.log('微信公众平台接入开发者成功, from: ' + ctx.href);
    } else {
        ctx.body = '微信公众平台接入开发者失败';
        console.error('微信公众平台接入开发者失败');
    }
}

function autoReply(ctx) {
    const body = ctx.request.body;
    const reqXML = body.xml;
    const xml = replyXML(reqXML);

    if (xml) {
        ctx.body = xml;
    } else {
        ctx.body = createTextXML(reqXML, '微信公众平台开发者服务端发生错误');
    }
}

async function getGlobalAccessToken() {
    const queryParams = {
        'grant_type': 'client_credential',
        'appid': wx.appId,
        'secret': wx.appSecret,
    };
    const options = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/cgi-bin/token?' + querystring.stringify(queryParams),
    };

    try {
        const result = await request(options);
        const body = JSON.parse(result);

        token.writeGlobalAccessToken(body.access_token);
    } catch (e) {
        console.error(e.message);
    }
}

async function createMenu() {
    const globalAccessToken = token.readGlobalAccessToken();
    const options = {
        method: 'POST',
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + globalAccessToken,
        form: JSON.stringify(menu),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };

    try {
        await request(options);
    } catch (e) {
        console.error(e.message);
    }
}

function getCode(ctx, type) {
    let scope = '';

    switch (type) {
        case OAUTH_BASE:
            {
                scope = 'snsapi_base';
                break;
            }
        case OAUTH_USERINFO:
            {
                scope = 'snsapi_userinfo'
                break;
            }
        default:
            {
                scope = '';
            }
    }

    const getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.appId}&redirect_uri=${wx.redirectUrl}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`;

    ctx.redirect(getCodeUrl);
}

function oauthBase(ctx) {
    getCode(ctx, OAUTH_BASE);
}

function oauthUserinfo(ctx) {
    getCode(ctx, OAUTH_USERINFO);
}

async function getOauthAccessToken(code) {
    const options = {
        method: 'GET',
        url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wx.appId}&secret=${wx.appSecret}&code=${code}&grant_type=authorization_code`,
    };

    try {
        const body = await request(options);

        if (body) {
            token.writeOauth(body);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e.message);
        return false;
    }
}

async function oauthCode(ctx) {
    const code = ctx.query.code || '';
    let errmsg = '';

    if (code) {
        const result = await getOauthAccessToken(code);

        if (result) {
            ctx.redirect('/userinfo');
        } else {
            errmsg = '无法获取oauth access token';
            ctx.body = errmsg;
            console.error(errmsg);
        }
    } else {
        errmsg = '无法获取oauth code';
        ctx.body = errmsg;
        console.error(errmsg);
    }
}

async function userinfo(ctx) {
    const oauthAccessToken = token.readOauth('access_token');
    const oauthOpenId = token.readOauth('openid');
    const scope = token.readOauth('scope');

    if (scope.indexOf('snsapi_userinfo') !== -1) {
        const options = {
            method: 'GET',
            url: `https://api.weixin.qq.com/sns/userinfo?access_token=${oauthAccessToken}&openid=${oauthOpenId}&lang=zh_CN`,
        };

        try {
            const body = await request(options);

            ctx.body = body;
        } catch (e) {
            ctx.body = e.message;
            console.error(e.message);
        }
    } else if (scope === 'snsapi_base') {
        const errmsg = 'oauth scope 是snsapi_base类型的认证无法获取用户基本信息';
        ctx.body = errmsg;
        console.error(errmsg);
    }
}

async function refreshOauthAccessToken() {
    const refreshToken = token.readOauth('refresh_token');
    const options = {
        method: 'GET',
        url: `https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=${wx.appId}&grant_type=refresh_token&refresh_token=${refreshToken} `,
    };

    try {
        const body = await request(options);

        token.writeOauth(body);
    } catch (e) {
        console.error(e.message);
    }
}

async function getJsapiTicket() {
    const globalAccessToken = token.readGlobalAccessToken();
    const options = {
        method: 'GET',
        url: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${globalAccessToken}&type=jsapi`,
    };

    try {
        const result = await request(options);
        const body = JSON.parse(result);

        token.writeJsapiTicket(body.ticket);
    } catch (e) {
        console.error(e.message);
    }
}

function jsapi(ctx) {
    const signed = signature.jsapi(ctx.query.url);

    ctx.body = JSON.stringify(signed);
}

export {
    check,
    autoReply,
    getGlobalAccessToken,
    createMenu,
    oauthBase,
    oauthUserinfo,
    oauthCode,
    userinfo,
    refreshOauthAccessToken,
    getJsapiTicket,
    jsapi,
};