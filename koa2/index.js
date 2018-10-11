const Koa = require('koa');
const Router = require('koa-router');
const moment = require('moment');

const app = new Koa();
const router = new Router();
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

const logger = message => console.log(`[${moment().format(TIME_FORMAT)}] [INFO] - ${message}`);

const loggerOnline = require('../src');

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  logger(`${ctx.method} ${ctx.url} - ${ctx.response.status} ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// load logger-online middleware
app.use(loggerOnline('test-server', 'localhost:3001'));

// router list
router.get('/', (ctx) => {
  ctx.body = 'Hello World';
  ctx.ilog(ctx.query);
});

// load router
app
  .use(router.routes())
  .use(router.allowedMethods());

// 404
app.use(async (ctx) => {
  ctx.body = 'Not Found';
  ctx.status = 404;
});

// error
app.on('error', (err) => {
  console.error('server error :', err);
});

app.listen(3000);
