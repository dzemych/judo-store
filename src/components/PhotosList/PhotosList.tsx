import {FC, useState} from "react"
import classes from './PhotosList.module.sass'
import ImgPreview from "@components/PhotosList/ImgPreview"
import AnimatedImg from "@components/UI/AnimatedImg"
import OpacityYDiv from "@components/UI/OpacityYDiv"


interface IProps {
   photos: string[]
   title?: null | string
   layout?: 'primary' | 'secondary'
}

const PhotosList: FC<IProps> = (
   {
      photos = [],
      title = 'Photos',
      layout = 'primary'
   }) => {

   const [imgPreview, setImgPreview] = useState(false)
   const [page, setPage] = useState(0)

   const cls = [classes.container, classes[layout]]

   const toggleImgPreview = () => {
      setImgPreview(prev => !prev)
   }

   const openImg = (i: number) => () => {
      setPage(i)
      setImgPreview(true)
   }

   const renderImg = (src: string, i: number) => (
      <div
         className={classes.item}
         key={src}
         onClick={openImg(i)}
      >
         <AnimatedImg
            photoSrc={src}
            whileInViewport={true}
            colorSchema={'white'}
            duration={.35}
         />
      </div>
   )

   return (
      <div className={cls.join(' ')}>
         { title &&
            <OpacityYDiv>
               <h1 className={classes.title}>{title}</h1>
            </OpacityYDiv>
         }

         <div className={classes.wrapper}>
            <ImgPreview
               srcArr={photos}
               open={imgPreview}
               close={toggleImgPreview}
               startAt={page}
            />

            <div className={classes.list}>
               { photos.map((el, i) => renderImg(el, i)) }
            </div>
         </div>
      </div>
   )
}

export default PhotosList