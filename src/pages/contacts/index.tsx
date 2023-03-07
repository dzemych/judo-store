import React, {FC} from "react"
import classes from './Contacts.module.sass'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebook, faInstagram, faTelegram, faViber} from "@fortawesome/free-brands-svg-icons"
import Loader from "@components/Loader/Loader"
import useDataState from "../../hooks/api/useDataState"
import {DataType} from "../../types/content/data"
import usePageData from "../../hooks/api/usePageData"
import BackImg from "@components/BackImg/BackImg"
import OpacityDiv from "@components/UI/OpacityDiv"
import {FetchStatus} from "../../types/status"
import Head from "next/head"
import NoRecordFound from "@components/Product/NoRecordFound/NoRecordFound";


const Contact: FC = () => {

   const { data, status } = useDataState(DataType.CONTACTS)
   const { backSrc } = usePageData('contacts')

   if (status === FetchStatus.INIT)
      return <div className={classes.loader_container}>
         <Loader/>
      </div>

   if (status === FetchStatus.NO_DATA)
      return <NoRecordFound/>

   const renderIcon = (icon: typeof faViber, url: string) => (
      <div className={classes.icon_container} onClick={() => { window.open(url) }}>
         <a href={data.facebook} target="_blank" rel='noreferrer'>
            <FontAwesomeIcon icon={icon} />
         </a>
      </div>
   )

   const renderRow = (key: string, title: string) => {
      if (!data[key])
         return null

      return (
         <div className={classes.row} key={key}>
            <div className={classes.row_title}>
               {title}:
            </div>

            <div className={classes.row_text}>
               {data[key]}
            </div>
         </div>
      )
   }

   return (
      <>
         <Head>
            <meta name='description' content='Контакти секції дзюдо новатор, як нас знайти'/>
            <title>Дзюдо Новатор | Наші контакти</title>
         </Head>

         <div className={classes.container}>

            <BackImg imageSrc={backSrc} />

            <OpacityDiv showAnimation={data} className={classes.wrapper}>
               <h2 className={classes.title}>
                  Наші контакти
               </h2>

               <div className={classes.contacts} style={{ paddingLeft: '8px' }}>
                  { data.tels &&
                     <div className={classes.row} key={'tels'} style={{ marginBottom: '18px' }}>
                        <div className={classes.row_title}>
                           Телефон:
                        </div>

                        <div className={classes.row_text}>
                           {data.tels.map((el: string) => <span key={el}>{el}</span>)}
                        </div>
                     </div>
                  }
                  { renderRow('email', 'Імейл') }
               </div>

               { data.address &&
                  <>
                     <h2 className={classes.title}>Наша адреса</h2>
                     <div
                        className={classes.row_text}
                        style={{ width: 'fit-content', paddingLeft: '8px' }}
                     >
                        {data.address}
                     </div>
                  </>
               }

               <div className={classes.social_container}>
                  { data.instagram && renderIcon(faInstagram, data.instagram) }
                  { data.facebook && renderIcon(faFacebook, data.facebook) }
                  { data.viber && renderIcon(faViber, data.viber) }
                  { data.telegram && renderIcon(faTelegram, data.telegram) }
               </div>
            </OpacityDiv>
         </div>
      </>
   )
}

export default Contact