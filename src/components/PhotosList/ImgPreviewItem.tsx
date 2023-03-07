import {
   FC,
   useEffect,
   useState,
   DragEvent,
   TouchEvent
} from "react"
import classes from './ImgPreview.module.sass'
import {FetchStatus} from "../../types/status"
import Loader from "../Loader/Loader"


type arg = (prev: boolean) => boolean
interface IProps {
   src: string
   blockNav: (val: boolean | arg) => void
   moveStatus: 'moving' | 'stable'
}

const initMove = { x: 0, y: 0 }

const ImgPreviewItem: FC<IProps> = ({ src, blockNav, moveStatus }) => {
   const [status, setStatus] = useState<FetchStatus>(FetchStatus.INIT)
   const [zoom, setZoom] = useState(false)
   const [moveStart, setMoveStart] = useState(initMove)
   const [crop, setCrop] = useState(initMove)
   const [duration, setDuration] = useState(0)

   const doubleClick = async () => {
      setZoom(prev => !prev)
   }

   const onDragStart = async (e: DragEvent) => {
      await setDuration(0)

      setMoveStart({ x: e.screenX, y: e.screenY })
   }

   const onDragMove = (e: DragEvent) => {
      console.log(e)
      const { screenX: x, screenY: y } = e
      if (x && y)
         setCrop({ x: x - moveStart.x, y: y - moveStart.y })
   }

   const onDragEnd = async () => {
      await setDuration(300)

      setCrop(initMove)
   }

   const onTouchStart = async (e: TouchEvent) => {
      if (e.touches.length === 1) {
         setDuration(0)
         setMoveStart({ x: e.touches[0].screenX, y: e.touches[0].screenY })
      }
   }

   const onTouchMove = (e : TouchEvent) => {
      if (e.touches.length === 1) {
         setCrop({
            x: (e.touches[0].screenX - moveStart.x) * .82,
            y: (e.touches[0].screenY - moveStart.y) * .82
         })
      }
   }

   const onTouchEnd = async () => {
      await setDuration(300)

      setMoveStart(initMove)
      setCrop(initMove)
   }

   useEffect(() => {
      const newImg = new Image()

      newImg.onload = () => { setStatus(FetchStatus.LOADED) }

      newImg.src = src
   }, [src])

   useEffect(() => {
      blockNav(zoom)
   }, [zoom])

   const imgStyle = {
      transform: `translate(${crop.x}px, ${crop.y}px)`,
      transition: `${duration}ms`,
   }

   return (
      <div className={classes.slider_item}>
         <div className={classes.slider_item_wrapper}>
            { status === FetchStatus.INIT &&
               <div className={classes.loader_container}>
                  <Loader/>
               </div>
            }

            { status !== FetchStatus.INIT &&
               <div className={classes.img}>
                  <img
                     style={imgStyle}
                     className={zoom ? classes.zoom_in : classes.zoom_out}
                     src={src}
                     alt=""
                     // draggable
                     onDoubleClick={moveStatus === 'stable' ? doubleClick : undefined}
                     onTouchMove={moveStatus === 'stable' ? onTouchMove : undefined}
                     onTouchStart={moveStatus === 'stable' ? onTouchStart : undefined}
                     onTouchEnd={moveStatus === 'stable' ? onTouchEnd : undefined}
                     onDragStart={moveStatus === 'stable' ? onDragStart : undefined}
                     onDrag={moveStatus === 'stable' ? onDragMove : undefined}
                     onDragEnd={moveStatus === 'stable' ? onDragEnd : undefined}
                  />
               </div>
            }
         </div>
      </div>
   )
}

export default ImgPreviewItem