'use strict';
const originWhitelist = require('./origin.whitelist');

const host = process.env.HOST || '0.0.0.0'
    , port = process.env.CORS_SERVER_PORT || 8080;

require('cors-anywhere')
    .createServer({
                      originWhitelist,
                      requireHeader: ['origin', 'x-requested-with'],
                      removeHeaders: ['cookie', 'cookie2'],
                      setHeaders: {
                          'cache-control': 'max-age=31536000'
                      }
                  })
    .listen(port, host, () => console.log(`Running CORS Anywhere on ${host}:${port}`));
