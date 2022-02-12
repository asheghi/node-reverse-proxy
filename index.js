const http = require("http")
const request = require('request')
const express = require('express')
const app = express();
const fs = require('fs');
const {join} = require('path');
const morgan = require('morgan');

const sites = loadSites();

app.use((req, res) => {
  const headers = req.headers;
  let reqHost = headers["host"];
  const vhost = sites[reqHost];
  if (!vhost) {
    return res.status(500).send('oops! something is not right');
  }
  return vhost.middleware(req,res);
})

let port = process.env.PORT || 80;
const host = process.env.host || '0.0.0.0';
http.createServer(app).listen(port,host,() => {
  console.log(`Proxy is listening at http://${host}:${port}`);
})


function loadSites() {
  const obj = {};
  fs.readdirSync(join(__dirname, 'sites'), {encoding: 'utf-8'})
    .filter(it => it.endsWith('.json'))
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

function getMiddleware(vhost){
  const app = express.Router();
  app.use(morgan(`:method ${vhost.domain} :url :status :res[content-length] - :response-time ms`))
  app.use( (req,res) => {
    const headers = req.headers;
    headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'] || (req.connection.encrypted) ? 'https' : 'http';
    headers['x-forwarded-for'] = getForwardedForHeader(headers, req);

    const url = `${vhost.protocol}://${vhost.host}:${vhost.port}${req.url}`;
    const x = request({
      method: req.method,
      url,
      headers,
    });
    req.pipe(x);
    x.pipe(res);
  });
  return app;
}
