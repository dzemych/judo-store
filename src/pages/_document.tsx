import { Html, Head, Main, NextScript } from 'next/document'
import React from "react"


export default function Document() {
   return (
      <Html lang='uk'>
         <Head>
            <meta charSet="UTF-8" />
            <meta name="author" content="Dzemych Ivan" />
            <meta httpEquiv="Content-Language" content="uk" />

            <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
            <link rel="icon" type="image/png" href="/favicon.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon180x180.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon16x16.png"/>
         </Head>
         <body>
         <Main />
         <NextScript />
         </body>
      </Html>
   )
}