const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {

   if (phase === PHASE_DEVELOPMENT_SERVER) return {
      reactStrictMode: false,
      swcMinify      : true,
      async rewrites() {
         return [
            {
               source: "/api/:path*",
               destination: `http://localhost:5000/api/:path*`
            }
         ]
      },
      async headers() {
         return [
            {
               // Apply these headers to all routes in your application.
               source: '/:path*',
               headers: [
                  {
                     key: 'Content-Security-Policy',
                     value: "img-src * data:;"
                  }
               ]
            }
         ]
      }
   }


   return {
      reactStrictMode: false,
      swcMinify      : true,
      async headers() {
         return [
            {
               // Apply these headers to all routes in your application.
               source: '/:path*',
               headers: [
                  {
                     key: 'Content-Security-Policy',
                     value: "img-src https: data: 'self' blob:;"
                  }
               ]
            }
         ]
      }
   }
}

module.exports = nextConfig