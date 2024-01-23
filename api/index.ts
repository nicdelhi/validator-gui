import apiRouter from './api'
import { apiLimiter, httpBodyLimiter, jwtMiddleware, loginHandler } from './auth'
import * as https from 'https';
import * as fs from 'fs';
import path from 'path';
import express from 'express';
import next from 'next';
import dotenv from 'dotenv';
import { cacheStaticFiles, preventBrowserCacheForDynamicContent, setSecurityHeaders } from './security-headers';
import { errorMiddleware } from './error-middleware';
import asyncRouteHandler from './handlers/async-router-handler';

dotenv.config()
const port = process.env.PORT ? +process.env.PORT : 8080
const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  const nextApp = next({dev: isDev, port})
  const nextHandler = nextApp.getRequestHandler()
  nextApp.prepare().then(() => {
    const app = express()
    app.use(httpBodyLimiter)
    app.use(apiLimiter)
    app.post('/auth/login', asyncRouteHandler(loginHandler))
    app.use('/api', jwtMiddleware, apiRouter)
    app.get('*', (req: any, res: any) => nextHandler(req, res))
    app.use(errorMiddleware(isDev))

    app.listen(port, () => {
      console.log(`STARTED SERVER IN DEVELOPMENT MODE`)
      console.log(`server started at http://localhost:${port}`)
    })
  })
} else {
  const app = express();
  app.use(httpBodyLimiter)
  app.use(apiLimiter)
  setSecurityHeaders(app);
  app.post('/auth/login', asyncRouteHandler(loginHandler))
  app.use('/api', jwtMiddleware, apiRouter)
  app.use(errorMiddleware(isDev))
  app.use(cacheStaticFiles);
  app.use(preventBrowserCacheForDynamicContent);
  app.use(express.static(path.join(__dirname, "..", "out"), {extensions: ['html']}));
  const privateKey = fs.readFileSync(path.join(__dirname, '../selfsigned.key'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, '../selfsigned.crt'), 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  https.createServer(credentials, app)
    .listen(port, () => {
      console.log(`STARTED SERVER IN PRODUCTION MODE`)
      console.log(`server started at https://localhost:${port}`)
    })
}
