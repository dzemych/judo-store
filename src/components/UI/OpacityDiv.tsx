import {FC} from "react"
import {motion} from 'framer-motion'
import { IAnimatedElProps } from 'src/types/IAnimatedElProps'


const OpacityDiv: FC<IAnimatedElProps> =
   ({
       children,
       className,
       whileInViewport,
       onClick,
       delay = 0,
       exit = false,
       id,
       duration = .45
   }) => {
   const variants = {
      initial: {
         opacity: 0
      },
      active: {
         opacity: 1,
         transition: {
            duration,
            delay: delay
         }
      },
      exit: {
         opacity: 0,
         transition: { duration }
      }
   }

   return (
      <motion.div
         className={className}
         onClick={onClick}
         variants={variants}
         initial='initial'
         animate={!whileInViewport ? 'active' : ''}
         exit={exit ? 'exit' : ''}
         whileInView={whileInViewport ? 'active' : ''}
         viewport={{ once: true }}
         id={id}
      >
         {children}
      </motion.div>
   )
}

export default OpacityDiv