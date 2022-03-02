import express from 'express'
import compression from 'compression'
import { createPageRenderer } from 'vite-plugin-ssr'
import vite from 'vite';
const isProduction = process.env.NODE_ENV === 'production'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const root = `${__dirname}/../../admin`
import Path from 'path';
import {authenticateRequest} from "../../api/auth/auth.middleware.js";
import {accessControlMiddleware} from "../acl.middleware.js";


export const getAdminRequestListener = async function () {
  const app = express()
  app.use(compression())

  let viteDevServer
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`))
  } else {
    viteDevServer = await vite.createServer({
      configFile: Path.resolve(__dirname, '../../vite.config.js'),
      root,
      server: { middlewareMode: 'ssr' },
    })
    app.use(viteDevServer.middlewares)
  }

  app.use(authenticateRequest);
  app.use(accessControlMiddleware)

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = {
      url,
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) return next()
    const { body, statusCode, contentType } = httpResponse
    res.status(statusCode).type(contentType).send(body)
  })
  return app;
};
