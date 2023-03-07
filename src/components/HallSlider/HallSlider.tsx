import {FC, useEffect, useState} from "react"
import classes from './HallSlider.module.sass'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons"
import {motion} from 'framer-motion'
import OpacityDiv from "@components/UI/OpacityDiv"
import {ISliderElement} from "../../types/ISliderElement"
import {useRouter} from "next/router"
import useHttp from "../../hooks/api/useHttp";


const HallSlider: FC = () => {
   const btnVariants = {
      pulse: {
         scale: 1.1,
         transition: {
            delay: 1,
            duration: .6,
            yoyo: Infinity,
            ease: 'easeIn'
         }
      }
   }

   const sliderVariants = {
      initial: {
         opacity: 0
      },
      active: {
         opacity: 1,
         transition: {
            duration: .5
         }
      }
   }

   const imgVariants = {
      hover: {
         scale: 1.07,
         transition: {
            duration: .4,
            ease: 'easeInOut'
         }
      }
   }

   const router = useRouter()

   const { requestJson } = useHttp()

   const [page, setPage] = useState(1)
   const [pages, setPages] = useState<ISliderElement[]>([])
   const [itemWidth, setItemWidth] = useState(0)
   const [duration, setDuration] = useState(0)
   const [pageAnimation, setPageAnimation] = useState(false)

   const changePage = (type: 'next' | 'prev') => {
      setPage(prev => {
         if (type === 'next')
            return prev + 1

         if (type === 'prev')
            return prev - 1

         return prev
      })
   }

   const renderSliderItem = (item: ISliderElement, idx: number) => (
      <div key={item.title + idx} className={classes.slider_item}>
         <div className={classes.img_container}>
            <div className={classes.backdrop}/>

            <img src={item.photoSrc} alt=""/>
         </div>
      </div>
   )

   const getPageNumber = () => {
      if (page > pages.length)
         return 1

      if (page === 0)
         return pages.length

      return page
   }

   const sliderClick = () => router.push('/hall')

   const fetchPages = async () => {
      const res = await requestJson('/api/data/hall')

      if (res?.item)
         setPages([{
            title: res.item.address,
            photoSrc: res.item.backPhoto,
            url: '/hall'
         }])

      // In future it is easy to have more than one "slide",
      // just write proper request and add res to pages
      // setPages([
      //    elements[elements.length - 1],
      //    ...elements,
      //    elements[0]
      // ])
   }

   // 1) Adds tail and start elements and item width
   useEffect(() => {
      fetchPages()
      setItemWidth(window.outerWidth)
   }, [])

   // 2) Replace elements to have infinite scroll
   useEffect(() => {
      if (page === 0)
         setTimeout(async () => {
            await setDuration(0)
            setPage(pages.length - 2)
         }, 400)

      if (page === pages.length - 1)
         setTimeout(async () => {
            await setDuration(0)
            setPage(1)
         }, 400)
   }, [page, pages.length])

   // 3) Change transition duration to normal
   useEffect(() => {
      if (duration === 0)
         setTimeout(() => {
            setDuration(400)
         }, 400)
   }, [duration])

   // 4) Change offset when about changes and loading
   useEffect(() => {
      setPageAnimation(true)
      setTimeout(() => {
         setPageAnimation(false)
      }, 400)
   }, [page])

   const sliderStyles = {
      transform: `translateX(${-(itemWidth * page)}px)`,
      transition: `${duration}ms ease-out`
   }

   if (!pages.length)
      return null

   if (pages.length === 1)
      return (
         <motion.div
            className={classes.container}
            variants={sliderVariants}
            initial='initial'
            whileInView='active'
            viewport={{ once: true }}
         >
            <OpacityDiv whileInViewport className={classes.title} delay={.4}>
               Наш зал
            </OpacityDiv>

            <OpacityDiv whileInViewport className={classes.subTitle} delay={.4}>
               {pages[0].title}
            </OpacityDiv>

            <div className={classes.slider_item} onClick={sliderClick}>
               <div className={classes.slider_container}>
                  <motion.div
                     className={classes.img_container}
                     variants={imgVariants}
                     whileHover='hover'
                  >
                     <motion.div
                        className={classes.backdrop}
                        whileHover={{ opacity: .35 }}
                     />

                     <img
                        src={pages[0].photoSrc}
                        alt=""
                     />
                  </motion.div>
               </div>
            </div>
         </motion.div>
      )

   return (
      <motion.div
         className={classes.container}
         variants={sliderVariants}
         initial='initial'
         whileInView='active'
         viewport={{ once: true }}
      >
         <OpacityDiv whileInViewport className={classes.title} delay={.2}>
            Halls
         </OpacityDiv>

         <OpacityDiv whileInViewport className={classes.pages} delay={.2}>
            {getPageNumber()}/{pages.length - 2}
         </OpacityDiv>

         <OpacityDiv whileInViewport className={classes.subTitle} delay={.2}>
            {pages[page].title}
         </OpacityDiv>

         <div className={classes.window}>
            <div
               className={classes.slider_container}
               style={sliderStyles}
            >
               {pages.map((el, i) => renderSliderItem(el, i))}
            </div>

            <OpacityDiv whileInViewport className={classes.slider_btns} delay={.5}>
               <motion.div
                  className={classes.btn_container}
                  onClick={() => !pageAnimation && changePage('prev')}
                  variants={btnVariants}
                  animate='pulse'
               >
                  <FontAwesomeIcon icon={faArrowLeft}/>
               </motion.div>

               <motion.div
                  className={classes.btn_container}
                  onClick={() => !pageAnimation && changePage('next')}
                  variants={btnVariants}
                  animate='pulse'
               >
                  <FontAwesomeIcon icon={faArrowRight}/>
               </motion.div>
            </OpacityDiv>
         </div>
      </motion.div>
   )
}

export default HallSlider