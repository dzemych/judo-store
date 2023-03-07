import {FC} from "react"
import classes from './BackImg.module.sass'
import {motion} from 'framer-motion'
import usePhotoFetchStatus from "../../hooks/api/usePhotoFetchStatus"
import {FetchStatus} from "../../types/status"


interface IProps {
   imageSrc: string
}

const BackImg: FC<IProps> = ({ imageSrc }) => {
   const variants = {
      hidden: { opacity: 0 },
      active: { opacity: 1, transition: { duration: .28, delay: .3 } }
   }

   const { fetchStatus } = usePhotoFetchStatus(imageSrc)

   return (
      <div className={classes.container}>
         <motion.div
            variants={variants}
            className={classes.shadow}
            initial='hidden'
            animate={fetchStatus === FetchStatus.LOADED ? 'active' : ''}
         />
         <motion.img
            variants={variants}
            src={imageSrc}
            alt=""
            initial='hidden'
            animate={fetchStatus === FetchStatus.LOADED ? 'active' : ''}
         />
      </div>
   )
}

export default BackImg