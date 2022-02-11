## Super Simple ReverseProxy

### what
a Node.js Web Server that forwards client requests to related application(domain:port).

### why
to deploy multiple node.js applications on the same server I needed an  **ultra light-weight**, **easy to use** alternative to nginx.

---

### Usage:
1.install package
```bash
git clone https://github.com/semycolon/node-reverse-proxy.git
cd node-reverse-proxy
npm i
```

2.define virtual hosts in hosts directory
```js
// sites/domain.com.json
{
  "host":"localhost",
  "port":3000,
  "domain": "domain.com",
  "protocol": "http"
}
```

3.single time running
```bash
sudo node index.js
```

it's recoommended to use PM2 to keep app running. you can also make pm2 listen to port 80 without sudo access by following this [guide](https://pm2.keymetrics.io/docs/usage/specifics/) 

## todos
- [ ] forward websocket
- [ ] rewrite headers

