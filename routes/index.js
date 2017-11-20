import { check, autoReply, oauthBase, oauthUserinfo, oauthCode, userinfo, jsapi } from '../controllers/wx';

function routes(ctx, route) {
    ctx.use(route.get('/', check));//req from wx
    ctx.use(route.post('/', autoReply));//request from wx
    ctx.use(route.get('/oauth/base', oauthBase));
    ctx.use(route.get('/oauth/userinfo', oauthUserinfo));
    ctx.use(route.get('/oauth/code', oauthCode));//request from wx
    ctx.use(route.get('/userinfo', userinfo));
    ctx.use(route.get('/jsapi', jsapi));
}

export default routes;