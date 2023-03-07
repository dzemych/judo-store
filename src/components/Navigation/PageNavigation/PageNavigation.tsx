import {FC} from "react"
import classes from './PageNavigation.module.sass'
import {motion} from "framer-motion"
import OpacityDiv from "@components/UI/OpacityDiv"


interface IProps {
   nextPageClick: () => void
   prevPageClick: () => void
   page: number
   pagesCount: number
}

const PageNavigation: FC<IProps> = (
   {
      nextPageClick,
      prevPageClick,
      page,
      pagesCount
   }) => {
   const btnVariants = {
      twitch: (custom: number) => ({
         x: !custom ? -8 : 8,
         transition: {
            duration: .4,
            delay: .55,
            yoyo: Infinity,
            ease: 'easeIn'
         }
      })
   }

   // TODO btn text disappear on iphone in browser
   return (
      <OpacityDiv className={classes.navigation_container} whileInViewport>
         <div className={classes.btns_container}>
            {page > 1 && (
               <motion.div
                  className={classes.btn_wrapper}
                  onClick={prevPageClick}
                  variants={btnVariants}
                  animate='twitch'
                  custom={0}
               >
                  <div className={classes.prev_arrow}/>

                  <div className={classes.btn_text}>
                     Назад
                  </div>
               </motion.div>
            )}

            {page < pagesCount && (
               <motion.div
                  onClick={nextPageClick}
                  className={classes.btn_wrapper}
                  variants={btnVariants}
                  animate='twitch'
                  custom={1}
               >
                  <div className={classes.btn_text}>
                     Вперед
                  </div>

                  <div className={classes.next_arrow}/>
               </motion.div>
            )}
         </div>
      </OpacityDiv>
   )
}

export default PageNavigation