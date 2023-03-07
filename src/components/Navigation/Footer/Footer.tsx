import classes from './Footer.module.sass'
import {FC} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faInstagram, faViber, faFacebook, faTelegram } from "@fortawesome/free-brands-svg-icons"
import {motion} from "framer-motion"
import {useAppSelector} from "../../../hooks/useRedux"


const Footer: FC = () => {

   const socialLinks = useAppSelector(state => state.socialLinksReducer)

   const iconVariants = {
      initial: {
         color: '#b5b5b5'
      },
      hover: {
         y: -8,
         scale: 1.3,
         color: '#f4f4f4',
         transition: {
            duration: .3,
            ease: 'easeOut'
         }
      }
   }

   const icons = {
      instagram: faInstagram,
      facebook: faFacebook,
      viber: faViber,
      telegram: faTelegram,
   }

   const renderIcon = (key: string) => {
      if (!key || !socialLinks || !socialLinks[key as keyof typeof socialLinks])
         return null

      return (
         <motion.div
            key={key}
            className={classes.icon_container}
            variants={iconVariants}
            initial='initial'
            whileHover='hover'
            onClick={() => { window.open(socialLinks[key as keyof typeof socialLinks]) }}
         >
            <FontAwesomeIcon icon={icons[key as keyof typeof icons]}/>
         </motion.div>
      )
   }

   return (
      <div className={classes.container}>
         <div className={classes.wrapper}>
            <div className={classes.icons_container}>
               { socialLinks &&
                  Object.keys(socialLinks).map(renderIcon)
               }
            </div>

            <div className={classes.hr}/>

            <div className={classes.content}>
               <span className={classes.copyRight_container}>
                  © Copyright {new Date().getFullYear()} Judo-Store. All rights reserved.
               </span>

               <div className={classes.author_container}>
                  Powered by -&nbsp;

                  <a href="https://www.linkedin.com/in/dzemych/" target='_blank' rel='noreferrer'>
                     Dzemych Ivan
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Footer