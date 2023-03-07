import '../assets/styles/fonts.sass'
import '../assets/styles/global.sass'
import '../assets/styles/editor.css'
import type { AppProps } from 'next/app'
import React, {useCallback} from 'react'
import MainLayout from '../layouts/MainLayout'
import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import PageLoader from "@components/Loader/PageLoader"
import { AppContext } from 'src/store/appContext'
import Head from "next/head"
import {Provider} from "react-redux"
import {setupStore} from "../store/store"
import WithGlobalData from "../layouts/WithGlobalData"


const store = setupStore()

function MyApp({ Component, pageProps }: AppProps) {
   const [newPage, setNewPage] = useState(false)
   const [showFooter, setShowFooter] = useState(true)
   const [isSidebar, setSidebar] = useState(false)

   const router = useRouter()

   const toggleNewPage = () => {
      setNewPage(prev => !prev)
   }

   const startPageHandler = useCallback(async (url: string) => {
      if (url !== router.asPath) {
         await setNewPage(true)
      }

      setTimeout(() => {
         document.body.scrollTo(0, 0)
      }, 300)
   }, [router.asPath])

   const completePageHandler = async () => {
      await setNewPage(false)
   }

   useEffect(() => {
      router.events.on('routeChangeStart', startPageHandler)
      router.events.on('routeChangeComplete', completePageHandler)
      router.events.on('routeChangeError', completePageHandler)

      return () => {
         router.events.off('routeChangeStart', startPageHandler)
         router.events.off('routeChangeComplete', completePageHandler)
         router.events.off('routeChangeError', completePageHandler)
      }
   }, [router.events, startPageHandler, completePageHandler])

   useEffect(() => {
      if (router.pathname === '/contacts')
         setShowFooter(false)
      else
         setShowFooter(true)
   }, [router.pathname])

   return (
      <Provider store={store}>
         <WithGlobalData>
            <Head>
               <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               <meta name='description' content='Блог про секцію дзюдо новатор у місті Хмельницький'/>

               <title>Дзюдо Новатор | Judo Novator</title>
            </Head>

            <AppContext.Provider value={{
               newPage,
               toggleNewPage,
               isSidebar,
               setSidebar,
               curPage: router.pathname,
            }}>
               <MainLayout footer={showFooter || newPage}>
                  <PageLoader/>
                  <Component {...pageProps}/>
               </MainLayout>
            </AppContext.Provider>
         </WithGlobalData>
      </Provider>
   )
}

export default MyApp