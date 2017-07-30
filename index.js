'use strict';
const host = process.env.HOST || '0.0.0.0'
    , port = process.env.PORT || 8080;

require('cors-anywhere')
    .createServer({
                      originWhitelist: ['http://localhost:4200', 'http:/bdtem.co.in'],
                      requireHeader: ['origin', 'x-requested-with'],
                      removeHeaders: ['cookie', 'cookie2']
                  })
    .listen(port, host, () => console.log(`Running CORS Anywhere on ${host}:${port}`));
