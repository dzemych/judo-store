import {FC, useEffect, useRef, useState} from "react"
import classes from './AnimatedImg.module.sass'
import {motion} from "framer-motion"
import {IAnimatedElProps} from "../../types/IAnimatedElProps"
import {FetchStatus} from "../../types/status"
import Loader from "@components/Loader/Loader"


interface IProps extends IAnimatedElProps {
   photoSrc: string
   shadow?: boolean
   animationType?: 'opacity' | 'curtain'
   backWhileLoading?: boolean
}

const AnimatedImg: FC<IProps> =
   ({
       photoSrc,
       delay = .2,
       whileInViewport,
       onClick,
       colorSchema = 'black',
       shadow = true,
       animationType= 'curtain',
       backWhileLoading = true,
       hoverAnimation = true,
       duration = .45
   }) => {

   const [status, setStatus] = useState(FetchStatus.INIT)
   const imgRef = useRef<HTMLImageElement | null>(null)

   const curtainVariants = {
      initial: {
         height: '100%'
      },
      active: {
         height: 0,
         transition: {
            duration: duration,
            delay: delay,
            ease: 'linear'
         }
      },
   }

   const imgCurtainVariants = {
      initial: {
         filter: 'blur(3px)',
         scale: .96,
      },
      active: {
         scale: 1,
         filter: 'blur(0px)',
         transition: {
            duration: duration - .05,
            delay: delay + .35,
            ease: 'linear'
         }
      }
   }

   const imgOpacityVariants = {
      initial: { filter: 'blur(3px)' },
      active: {
         filter: 'blur(0px)',
         transition: {
            duration: duration - .05,
            delay: delay + .35,
            ease: 'linear'
         }
      }
   }

   const loaderVariants = {
      active: { opacity: 1 },
      hidden: { opacity: 0, transition: { duration: .28 } }
   }

   const cls = [classes.container]
   const curtainCls = [classes.curtain, classes[colorSchema]]
   const loadCls = [classes.img_loading]

   if (status !== FetchStatus.INIT)
      loadCls.push(classes.hide_load)

   if (status === FetchStatus.LOADED && hoverAnimation)
      cls.push(classes.active_hover)

   useEffect(() => {
      const newImg = new Image()

      newImg.onload = () => { setStatus(FetchStatus.LOADED) }

      newImg.src = photoSrc
   }, [photoSrc])

   return (
      <div className={cls.join(' ')} onClick={onClick}>
         { shadow && <div className={classes.backdrop}/> }

         { animationType === 'curtain' &&
            <motion.div
               className={curtainCls.join(' ')}
               variants={curtainVariants}
               initial='initial'
               animate={ (!whileInViewport && status === FetchStatus.LOADED) ? 'active' : '' }
               whileInView={ (whileInViewport && status === FetchStatus.LOADED) ? 'active' : '' }
               viewport={{ once: true }}
            />
         }

         <div className={classes.img_container}>
            <motion.div
               className={loadCls.join(' ')}
               style={{ background: backWhileLoading ? 'rgb(244, 244, 244)' : 'transparent' }}
               variants={loaderVariants}
               initial={'active'}
               animate={ status === FetchStatus.LOADED ? 'hidden' : '' }
            >
               <Loader/>
            </motion.div>

            <motion.img
               className={classes.img}
               src={photoSrc}
               ref={imgRef}
               variants={animationType === 'curtain' ? imgCurtainVariants : imgOpacityVariants}
               initial='initial'
               animate={ (!whileInViewport && status === FetchStatus.LOADED) ? 'active' : '' }
               whileInView={ (whileInViewport && status === FetchStatus.LOADED) ? 'active' : '' }
               viewport={{ once: true }}
            />
         </div>
      </div>
   )
}

export default AnimatedImg