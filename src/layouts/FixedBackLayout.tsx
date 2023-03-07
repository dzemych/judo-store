import React, {FC} from "react"
import classes from './FixedBackLayout.module.sass'
import BackImg from "@components/BackImg/BackImg"
import MainBack from "@components/MainBack/MainBack"
import usePageData from "../hooks/api/usePageData"
import OpacityDiv from "@components/UI/OpacityDiv"
import {useAppSelector} from "../hooks/useRedux"


interface IProps {
   children: React.ReactNode
   beforeTitle?: string
   pageName?: string
   title?: string
   backImgSrc?: string
   delay?: number
}

const FixedBackLayout: FC<IProps> = (
   {
      title,
      beforeTitle = '',
      children,
      backImgSrc,
      pageName= '',
      delay = 0
   }) => {
   
   const { medium } = useAppSelector(state => state.mediaReducer)
   const { title: fetchedTitle, backSrc: fetchedPhoto, status: photoFetchStatus } = usePageData(pageName)

   return (
      <div className={classes.container}>
         { (medium && (backImgSrc || fetchedPhoto)) &&
            <BackImg imageSrc={backImgSrc ? backImgSrc : fetchedPhoto}/>
         }

         <MainBack
            beforeTitle={beforeTitle}
            title={title ? title : fetchedTitle}
            type={medium ? 'wide' : 'top'}
            transparent={medium}
            height={medium ? 'medium' : 'tall'}
            photoSrc={backImgSrc ? backImgSrc : fetchedPhoto}
            photoFetchStatus={photoFetchStatus}
         />

         <div className={classes.content}>
            <OpacityDiv
               duration={.35}
               className={classes.content_wrapper}
               delay={delay}
            >
               { medium && <div className={classes.wrapper_back}/> }

               { children }
            </OpacityDiv>
         </div>
      </div>
   )
}

export default FixedBackLayout