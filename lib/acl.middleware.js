export async function accessControlMiddleware(req, res, next) {
  const { url } = req;

  if (req.user && url.startsWith('/login')) {
    return res.redirect('/');
  }

  if (!req.user && !url.startsWith('/login')) {
    return res.redirect('/login');
  }

  return next();
}
