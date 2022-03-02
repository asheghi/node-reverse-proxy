import db from "../../lib/database.js";
import JwtUtils from "../../lib/jwt-utils.js";
const debug = console.log;

// try to fill req.user based on jwt token inside cookie header
export const authenticateRequest = (req, res, next) => {
  try {
    JwtUtils.verifyRequest(req);
  } catch (e) {
    // ignore error
  }
  return next();
};

export async function authGuard(req, res, next) {
  if (!req.user) return res.status(401).send();
  const exists = db.users.find(it => it.email === req.user.email);
  if (!exists) return res.status(401).send();
  return next();
}

export function redirectUnAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  debug('redirecting to login');
  return res.redirect('/auth/login');
}

export function redirectAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  debug('redirecting to admin');
  return res.redirect('/admin');
}
