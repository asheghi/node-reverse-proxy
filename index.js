const http = require("http")
const request = require('request')
const express = require('express')
const app = express();
const fs = require('fs');
const {join} = require('path');
const morgan = require('morgan');

if (process.env.BEHIND_PROXY) app.enable('trust proxy');

const sites = loadSites();

const domains = Object.keys(sites);
if (!domains.length) {
  console.log("No Site were loaded from ./sites directory!");
  return 0;
}
domains.forEach(domain => {
  const vhost = sites[domain];
  const {host, protocol, port} = vhost;
  console.log(`** forwarding ${domain} to ${protocol}://${host}:${port} **`);
})

app.use((req, res) => {
  const headers = req.headers;
  let reqHost = headers["host"];
  if (reqHost.indexOf(':') > -1) reqHost = reqHost.substring(0, reqHost.indexOf(':'));
  const vhost = sites[reqHost];
  if (!vhost) {
    console.log('vhost', vhost, reqHost);
    return res.status(500).send('oops! something is not right');
  }
  return vhost.middleware(req, res);
})

let port = process.env.PORT || 80;
const host = process.env.HOST || '0.0.0.0';
http.createServer(app).listen(port, host, () => {
  console.log(`Proxy is listening at http://${host}:${port}`);
})


function loadSites() {
  const obj = {};
  fs.readdirSync(join(__dirname, 'sites'), {encoding: 'utf-8'})
    .filter(it => it.endsWith('.js'))
    .map(it => ({
      ...require('./sites/' + it),
      filename: it,
    }))
    .forEach(it => {
      const {domain, host, port,} = it;
      if (!(domain && host && port)) {
        console.error('bad config file!');
        return;
      }
      it.middleware = getMiddleware(it);
      obj[it.domain] = it;
    })
  return obj;
}

function getForwardedForHeader(headers, req) {
  let forwardedFor = '';
  if (headers['cf-connecting-ip']) {
    forwardedFor += headers['cf-connecting-ip'] + ', ';
  }
  if (headers['x-forwarded-for']) {
    forwardedFor += headers['x-forwarded-for'] + ', ';
  }
  if (req.connection.remoteAddress) {
    forwardedFor += req.connection.remoteAddress;
  }
  return forwardedFor;
}

function getMiddleware(vhost) {
  const app = express.Router();
  app.use(morgan(`${vhost.domain} :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`));
  if (vhost.enableCors) {
    const cors = require('cors');
    app.use(cors(vhost.corsOptions));
  }
  if (vhost.basicAuth && vhost.basicAuth.users) {
    const basicAuth = require('express-basic-auth')
    app.use(basicAuth({
      challenge: true,
      ...vhost.basicAuth,
    }))
  }
  app.use((req, res) => {
    let headers = req.headers;
    headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'] || (req.connection.encrypted) ? 'https' : 'http';
    headers['x-forwarded-for'] = getForwardedForHeader(headers, req);
    headers['x-forwarded-host'] = vhost.domain;

    if (vhost.modifyHeader && vhost.modifyHeader) headers = vhost.modifyHeader(headers);

    const url = `${vhost.protocol}://${vhost.host}:${vhost.port}${req.url}`;
    const x = request({
      method: req.method,
      url,
      headers,
    });
    req.pipe(x);
    x.pipe(res)
    x.on('error', err => {
      console.error(err);
      res.status(521).send('the origin web server refuses connections')
    })
  });
  return app;
}
