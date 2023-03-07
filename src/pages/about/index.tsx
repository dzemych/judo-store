import React, {FC} from "react"
import classes from './About.module.sass'
import useDataState from "../../hooks/api/useDataState"
import {DataType} from "../../types/content/data"
import FixedBackLayout from "../../layouts/FixedBackLayout"
import {FetchStatus} from "../../types/status"
import Loader from "@components/Loader/Loader"
import Head from "next/head"
import NoRecordFound from "@components/Product/NoRecordFound/NoRecordFound";


const About: FC = () => {
   const { data, status } = useDataState(DataType.ABOUT)

   if (status === FetchStatus.INIT)
      return <div className={classes.loader_container}>
         <Loader/>
      </div>

   if (status === FetchStatus.NO_DATA)
      return <NoRecordFound/>

   if (!data) return <NoRecordFound/>

   return (
      <>
         <Head>
            <meta name='description' content='Історія секції дзюдо новатор у місті Хмельницький'/>
            <title>Дзюдо Новатор | Про нас</title>
         </Head>

         <div className={classes.container}>
            <FixedBackLayout backImgSrc={data.backPhoto} title={data.title}>
               {data?.content &&
                  <div className='ck-content' dangerouslySetInnerHTML={{ __html: data.content }}/>
               }
            </FixedBackLayout>
         </div>
      </>
   )
}

export default About