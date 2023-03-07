import {FC, useContext, useEffect, useState} from "react"
import classes from './PageLoader.module.sass'
import {AppContext} from "../../store/appContext"
import JudoCircle from "../../assets/icons/JudoCircle"


const PageLoader: FC = () => {

   const { newPage, isSidebar } = useContext(AppContext)
   const [status, setStatus] = useState<'init' | 'start' | 'end' | 'played'>('init')

   const cls = [classes.container]
   const miniCls = [classes.mini_loader]

   if (status !== 'init' && status !== 'played')
      miniCls.push(classes.mini_active)

   // Add main animation
   if (status === 'start' && isSidebar)
      cls.push(classes.moment_active)
   else if (status === 'start')
      cls.push(classes.active)
   else if (status === 'end')
      cls.push(classes.exit)
   else if (status === 'played')
      cls.push(classes.played)
   else
      cls.push(classes.initial)

   useEffect(() => {
      (async () => {
         if (newPage) {
            await setStatus('start')

            setTimeout(async () => {
               setStatus('end')
            }, 650)
         }

         if (!newPage && status === 'end') {
            setTimeout(async () => {
               setStatus('played')
            }, 400)
         }
      })()
   }, [newPage, status])

   useEffect(() => {
      if (status === 'init' || status === 'played')
         document.body.style.overflow = 'scroll'
      else
         document.body.style.overflow = 'hidden'
   }, [status])

   return (
      <>
         <div className={miniCls.join(' ')}>
            <JudoCircle/>
         </div>

         <div className={cls.join(' ')}/>
      </>
   )
}

export default PageLoader