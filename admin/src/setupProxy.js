const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
   app.use(
      '/api',
      createProxyMiddleware({
         target: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://localhost:5000`,
         changeOrigin: true,
      })
   );
};