const Express = require('express');
const bodyParser = require('body-parser');
const {authGuard} = require('./auth.middleware');
const {AuthService} = require('./auth.service');
const {JwtUtils} = require('../../lib/jwt-utils');
const {jwtCookieField} = require('../../lib/config.js');
const {getDebug} = require("../../lib/common-utils");
const debug = getDebug('auth:router');
const cookieMaxAge = 12 * 60 * 60 * 1000;

const app = Express.Router();

app.post('/setup', bodyParser.json(), async (req, res) => {
  const {body: {email, password}} = req;
  const user = await AuthService.setupAdminUser(email, password);
  if (!user) return res.status(400).send('something is not right!');
  const token = JwtUtils.generateTokenForRequest(req, user);
  res.cookie(jwtCookieField, token, {maxAge: cookieMaxAge});
  return res.json({success: !!user});
});

app.post('/login', bodyParser.json(), async (req, res) => {
  const {body: {email, password}} = req;
  const user = await AuthService.login(email, password);
  if (!user) return res.status(400).json({success: false});
  const token = JwtUtils.generateTokenForRequest(req, {email});
  res.cookie(jwtCookieField, token, {maxAge: cookieMaxAge});
  res.send('');
});

app.use(authGuard);

app.get('/me', (req, res) => {
  const {email} = req.user;
  res.json({email});
});
module.exports.AuthRouter = app;