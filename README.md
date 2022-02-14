## Super Simple ReverseProxy

#### what?
a Node.js Web Server that forwards client requests to the related application(domain:port)

#### why?
to deploy multiple node.js applications on the same Server I needed an  **ultra light-weight**, **easy to use** alternative to Nginx.

### how?
it simply uses an **Express.js** Web Server with **Streaming** feature of [Request](https://github.com/request/request#readme) package.
```javascript
app.get((req,res) => {
  req.pipe(request({/* modified request options */}).pipe(res));
})
```

### Extra Features
custom write header function
logging with morgan
basic-authentication
cors
---

### Usage:
> let's suppose we have an application up and running in our server on port 3000, and we have domain.com pointing to Server IP.

1. install package
```bash
git clone https://github.com/semycolon/node-reverse-proxy.git
cd node-reverse-proxy
npm i
```

2. define virtual hosts in the sites directory
```js
// sites/domain.com.json
module.exports = {
  host: "0.0.0.0",
  port: 8085,
  domain: "studio.me",
  protocol: "http",
  basicAuth: {
    users: {'admin': 'password',}
  },
  enableCors: true,
  corsOptions: {},
  modifyHeader:(header) => {
    header['custom-header'] = 'custom header';
    return header;
  }
}
```

3. single time running
```bash
sudo node index.js
```

it's recommended to use PM2 to keep the app running. you can also make pm2 listen to port 80 without sudo access by
following this [guide](https://pm2.keymetrics.io/docs/usage/specifics/)

