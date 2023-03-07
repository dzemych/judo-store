import React, {FC, useEffect, useState} from "react";
import classes from "./Home.module.sass";
import Loader from "../../components/UI/Loader";


interface IProps {
   url: string | null
}

const ImgContainer: FC<IProps> = ({ url }) => {
   const [imgLoading, setImgLoading] = useState(false)

   useEffect(() => {
      if (!url) return

      if (url === 'loading') {
         setImgLoading(true)
         return
      }

      const newImg = new Image()

      setImgLoading(true)

      newImg.onload = () => { setImgLoading(false) }

      newImg.src = url
   }, [url])

   if (!url) return null

   return (
      <div className={classes.img_wrapper}>
         { imgLoading &&
            <div className={classes.loader_container}>
               <Loader/>
            </div>
         }

         <img src={url} alt=""/>
      </div>
   )
}

export default ImgContainer