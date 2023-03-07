import {FC, useEffect, useState, TouchEvent} from "react"
import classes from './ImgPreview.module.sass'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faXmark, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import ReactDOM from "react-dom"
import ImgPreviwItem from "./ImgPreviewItem";
import {useAppSelector} from "../../hooks/useRedux"


interface IProps {
   srcArr:  string[]
   open: boolean
   close: () => void
   startAt?: number
}

const ImgPreview: FC<IProps> = (
   {
      srcArr,
      open,
      close,
      startAt = 0
   }) => {

   const { medium } = useAppSelector(state => state.mediaReducer)

   const [status, setStatus] = useState<'moving' | 'stable'>('stable')
   const [duration, setDuration] = useState('300ms')
   const [page, setPage] = useState(startAt)
   const [offset, setOffset] = useState(0)
   const [isZoom, setIsZoom] = useState(false)

   const [startPosition, setStartPosition] = useState(0)
   const [oldOffset, setOldOffset] = useState(0)
   const [moveX, setMoveX] = useState(0)

   const touchStart = async (e: TouchEvent) => {
      if (!isZoom && e.touches.length < 2) {
         await setDuration('0ms')
         await setStatus('moving')

         setStartPosition(e.touches[0].screenX)
         setOldOffset(offset)
      }
   }

   const touchMove = (e: TouchEvent) => {
      if (!isZoom && e.touches.length < 2) {
         const moveX = startPosition - e.touches[0].screenX
         setOffset(oldOffset + moveX)
         setMoveX(moveX)
      }
   }

   const touchEnd = async (e: TouchEvent) => {
      if (!isZoom && e.touches.length < 2) {
         await setDuration('300ms')

         const vw = window.innerWidth

         const k = offset / vw
         const pageCount = srcArr.length - 1

         if (k < 0)
            await setPage(0)
         else if (k > pageCount)
            await setPage(pageCount)
         else
            await setPage(prev => {
               if (moveX > 0)
                  if (Math.floor(( k - prev ) / .18) > 0)
                     return prev + 1

               if (moveX < 0)
                  if (Math.abs(Math.floor(( k - prev ) / .18)) > 1)
                     return prev - 1

               return prev
            })

         await setStatus('stable')
      }
      setMoveX(0)
   }

   const nextClick = () => {
      if (!isZoom) {
         setPage(prev => {
            if (prev + 1 > srcArr.length - 1)
               return prev

            return prev + 1
         })
      }
   }

   const prevClick = () => {
      if (!isZoom) {
         setPage(prev => {
            if (prev - 1 < 0)
               return prev

            return prev - 1
         })
      }
   }

   const keyListener = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft')
         prevClick()

      if (e.code === 'ArrowRight')
         nextClick()

      if (e.code === 'Escape')
         close()
   }

   useEffect(() => {
      if (status === 'stable')
         setOffset(page * window.innerWidth)
   }, [page, window.innerHeight, status])

   useEffect(() => {
      if (open)
         document.body.style.overflowY = 'hidden'
      else
         document.body.style.overflowY = 'scroll'

      return () => {
         document.body.style.overflowY = 'scroll'
      }
   }, [open])

   useEffect(() => {
      setPage(startAt)
   }, [startAt])

   useEffect(() => {
      document.addEventListener('keyup', keyListener)
      return () => {
         document.removeEventListener('keyup', keyListener)
      }
   }, [isZoom])

   const style = {
      transition: duration,
      transform: `translateX(${-offset}px)`,
   }

   const renderNavigation = () => {
      if (!medium)
         return null

      return (
         <>
            { page !== 0 &&
               <div className={classes.left_container} onClick={prevClick}>
                  <FontAwesomeIcon
                     icon={faChevronLeft}
                     className={classes.nav_icon}
                  />
               </div>
            }

            { page + 1 < srcArr.length &&
               <div className={classes.right_container} onClick={nextClick}>
                  <FontAwesomeIcon
                     icon={faChevronRight}
                     className={classes.nav_icon}
                  />
               </div>
            }
         </>
      )
   }

   return ReactDOM.createPortal(
      <div
         className={classes.container}
         onTouchStart={touchStart}
         onTouchMove={touchMove}
         onTouchEnd={touchEnd}
         style={{
            pointerEvents: open ? 'initial' : 'none',
            opacity: open ? 1 : 0,
            position: open ? 'fixed' : 'absolute',
            zIndex: open ? 999 : 0,
            overflow: 'hidden',
            transition: '280ms'
         }}
      >
         <div className={classes.backdrop}/>
         <div className={classes.close_icon} onClick={close}>
            <FontAwesomeIcon icon={faXmark}/>
         </div>

         <div className={classes.slider_container}>

            { renderNavigation() }

            <div className={classes.window}>
               <div className={classes.slider} style={style}>
                  { srcArr.map(el =>
                     <ImgPreviwItem
                        src={el}
                        key={el}
                        blockNav={setIsZoom}
                        moveStatus={status}
                     />
                  ) }
               </div>
            </div>

         </div>
      </div>,
      document.body
   )
}

export default ImgPreview