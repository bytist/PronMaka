/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine as engine } from '@nguniversal/express-engine';
import { NgExpressEngineDecorator } from '@spartacus/core';
import * as express from 'express';
import { join } from 'path';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import { AppServerModule } from './src/main.server';
import { environment } from './src/environments/environment';

const ngExpressEngine = NgExpressEngineDecorator.get(engine);

// TODO: SSR Hack for Angular Universal HTTPS API requests issue (https://github.com/angular/universal/issues/856)
// This cannot be present in production env

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * For local (development) caching
 */
const cache = require('memory-cache');

// Client side routes
const csrRoutes = [
  '/my-account', // To avoid display login page (pre-rendered by ssr)
  '/order-confirmation',
  '/checkout',
];

const renderWithCache = (req, res, indexHtml) => {
  const entry = cache.get(req.originalUrl);
  if (entry) {
    res.send(entry);
  } else {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    }, (err, html) => {
      cache.put(req.originalUrl, html);
      res.send(html);
    });
  }
};

const renderPage = (req, res, indexHtml) => {
  if (!environment.localCacheEnabled) {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  } else {
    renderWithCache(req, res, indexHtml);
  }
};

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/maka-storefront');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    if (csrRoutes.filter(url => req.originalUrl.includes(url)).length > 0) {
      // render CSR
      res.sendFile(join(distFolder, 'index.html'));
    } else {
      // render SSR
      renderPage(req, res, indexHtml);
    }
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
