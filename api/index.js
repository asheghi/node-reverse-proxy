const Express = require('express');
const { AuthRouter } = require('./auth/auth.router');
const { authenticateRequest } = require('./auth/auth.middleware');

const baseUrlApi = '/api';
const app = Express.Router();

// simulate slow network on dev mode
if (process.env.SIMULATE_SLOW_NETWORK) {
  app.use(baseUrlApi, async (req, res, next) => {
    setTimeout(next, 1500);
  });
}

app.use(authenticateRequest);
app.use(`${baseUrlApi}/auth`, AuthRouter);

module.exports.ApiRouter = app;
