import {FC, useEffect, useState} from "react"
import classes from './MainBack.module.sass'
import ArrowDown from "../../assets/icons/ArrowDown"
import OpacityYDiv from "@components/UI/OpacityYDiv"
import {motion} from "framer-motion"
import {FetchStatus} from "../../types/status"
import Loader from "@components/Loader/Loader"
import usePageData from "../../hooks/api/usePageData"


interface IProps {
   pageName?: string
   title?: string
   photoSrc?: string
   beforeTitle?: string
   photoFetchStatus?: FetchStatus
   type?: 'top' | 'wide'
   transparent?: boolean
   showBtn?: boolean
   showImg?: boolean
   height?: 'tall' | 'medium'
   showLoader?: boolean
}

const MainBack: FC<IProps> = (
   {
      beforeTitle = '',
      pageName = '',
      title,
      photoSrc,
      photoFetchStatus,
      transparent,
      height = 'tall',
      type = 'top',
      showBtn = true,
      showImg = true,
      showLoader = true
   }) => {
   const arrowVariants = {
      bottom: {
         y: -38,
         transition: {
            duration: .5,
            delay: .2,
            yoyo: Infinity,
            ease: 'easeOut'
         }
      },
      wide: {
         y: -38,
         transition: {
            duration: 1,
            delay: .2,
            yoyo: Infinity,
            ease: 'easeOut'
         }
      }
   }
   const loaderVariants = {
      active: { opacity: 1 },
      hidden: { opacity: 0, transition: { duration: .28 } }
   }
   const imgVariants = {
      hidden: { opacity: 0 },
      active: { opacity: 1, transition: { duration: .28, delay: .25 } }
   }

   const {
      backSrc: fetchedPhoto,
      title: fetchedTitle,
      status: fetchDataStatus
   } = usePageData(pageName)
   const [status, setStatus] = useState(FetchStatus.INIT)

   const scrollToContent = () => {
      const vh = window.innerHeight
      let dist = vh * .8

      if (transparent)
         dist = vh * .70

      if (height === 'medium')
         dist = vh * .55

      document.body.scrollTo(0, dist)
   }

   const cls = [classes.container]

   const titleCls = [classes.title]

   if (type === 'top')
      titleCls.push(classes.top)

   if (type === 'wide')
      titleCls.push(classes.wide)

   if (transparent)
      cls.push(classes.transparent)

   if (height === 'medium')
      cls.push(classes.medium)

   useEffect(() => {
      const newImg = new Image()

      newImg.onload = () => { setStatus(FetchStatus.LOADED) }

      if (photoSrc)
         newImg.src = photoSrc
      else if (fetchedPhoto)
         newImg.src = fetchedPhoto

      if (
         !photoSrc &&
         photoFetchStatus !== FetchStatus.INIT &&
         !fetchedPhoto &&
         fetchDataStatus !== FetchStatus.INIT
      )
         setStatus(FetchStatus.LOADED)
   }, [photoSrc, photoFetchStatus, fetchDataStatus, fetchedPhoto])

   return (
      <div className={cls.join(' ')}>
         { (!transparent && showImg) &&
            <div className={classes.background}>
               { showLoader &&
                  <motion.div
                     className={classes.img_loader}
                     variants={loaderVariants}
                     initial={'active'}
                     animate={status === FetchStatus.LOADED ? 'hidden' : ''}
                  >
                     <Loader/>
                  </motion.div>
               }

               <motion.img
                  src={photoSrc ? photoSrc : fetchedPhoto}
                  alt=''
                  variants={imgVariants}
                  initial={'hidden'}
                  animate={
                     (status === FetchStatus.LOADED && (photoSrc || fetchedPhoto))
                     ? 'active' : ''
                  }
               />
               <div className={classes.opacity}/>
            </div>
         }

         <div className={classes.wrapper}>
            <OpacityYDiv className={titleCls.join(' ')}>
               <OpacityYDiv className={classes.title_text} showAnimation={!!title || !!fetchedTitle}>
                  <div>
                     {beforeTitle ? beforeTitle : ''} $
                  </div>
                  <div>
                     {title ? title : fetchedTitle}
                  </div>
               </OpacityYDiv>

               { showBtn && (type === 'wide') &&
                  <motion.div
                     className={classes.wide_wrapper}
                     variants={arrowVariants}
                     onClick={scrollToContent}
                     animate='wide'
                  >
                     <div className={classes.wide_text}>
                        bottom
                     </div>
                     <div className={classes.wide_icon}>
                        ▼
                     </div>
                  </motion.div>
               }
            </OpacityYDiv>

            { (showBtn && type !== 'wide') &&
               <motion.div
                  variants={arrowVariants}
                  className={classes.arrow_container}
                  onClick={scrollToContent}
                  animate={'bottom'}
               >
                  <ArrowDown className={classes.arrowDown}/>
               </motion.div>
            }

         </div>
      </div>
   )
}

export default MainBack