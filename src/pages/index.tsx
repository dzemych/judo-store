import type {NextPage} from 'next'
import classes from 'src/assets/styles/Home.module.sass'
import MainBack from "@components/MainBack/MainBack"
import List from "@components/Lists/List/List"
import React from "react"
import Head from "next/head"
import {useAppSelector} from "../hooks/useRedux"


const Home: NextPage = () => {
   const { large } = useAppSelector(state => state.mediaReducer)

   return (
      <>
         <Head>
            <meta name='description' content='Головна сторінка блогу дзюдо новатор | блог | події | галерея | команда '/>
            <title>Дзюдо Новатор | Головна сторінка</title>
         </Head>

         <div className={classes.container}>
            <MainBack
               pageName={'home'}
               type={large ? 'wide' : 'top'}
            />

            <div className={classes.wrapper}>
               <div className={classes.list_wrapper}>
                  <List
                     title={'Products'}
                     length={large ? 6 : 3}
                  />
               </div>
            </div>
         </div>
      </>
   )
}

export default Home