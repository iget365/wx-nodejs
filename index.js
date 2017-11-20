import { getGlobalAccessToken } from'./controllers/wx';
import bodyParser from 'koa-bodyparser';
import xmlParser from 'koa-xml-body';
import routes from './routes';
import serve from 'koa-static';
import route from 'koa-route';
import path from 'path';
import Koa from 'koa';

const app = new Koa();
const PORT = 9999;

getGlobalAccessToken();

app.use(xmlParser());
app.use(bodyParser());
app.use(serve('.'));//todo

routes(app, route);

app.listen(PORT);

console.log(`server started on port${PORT}.`);