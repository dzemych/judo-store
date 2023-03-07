import {FC, useEffect, useMemo, useState} from "react"
import {Grid, Typography} from "@mui/material"
import classes from './ImgInput.module.sass'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import Loader from "../UI/Loader";


interface IProps {
   type: 'single' | 'multi'
   img: File | string
   idx: number
   deleteHandler: (idx: number) => void
   prevHandler?: (idx: number) => void
   nextHandler?: (idx: number) => void
   firstHandler?: (idx: number) => void
}

const ImgItem: FC<IProps> = (props) => {

   const imgSrc = useMemo(() => {
      if (typeof props.img === 'string') return props.img

      return URL.createObjectURL(props.img)
   }, [props.img])
   const [imgLoading, setImgLoading] = useState(false)

   const prevClick = () => {
      if (props.prevHandler)
         props.prevHandler(props.idx)
   }

   const nextClick = () => {
      if (props.nextHandler)
         props.nextHandler(props.idx)
   }

   const firstClick = () => {
      if (props.firstHandler)
         props.firstHandler(props.idx)
   }

   const deleteClick = () => {
      if (props.deleteHandler)
         props.deleteHandler(props.idx)
   }

   const renderBtns = () => {
      if (props.type === 'multi') return <>
         <div className={classes.item_action_btn_row}>
            <ArrowBackIcon onClick={prevClick}/>
            <ArrowForwardIcon onClick={nextClick}/>
         </div>

         <div className={classes.item_action_btn_row}>
            <HomeIcon onClick={firstClick}/>
            <DeleteIcon onClick={deleteClick}/>
         </div>
      </>

      if (props.type === 'single')
         return <div className={classes.bigBtn}>
            <DeleteIcon onClick={deleteClick}/>
         </div>
   }

   const cls = [classes.item_container]
   if (props.idx === 0)
      cls.push(classes.main_item)

   useEffect(() => {
      const newImg = new Image()

      setImgLoading(true)

      newImg.onload = () => { setImgLoading(false) }

      newImg.src = imgSrc
   }, [imgSrc])

   return (
      <Grid item xs={6} sm={4} md={3} sx={{
         position: 'relative',
         display: 'flex',
         flexDirection: 'column'
      }}>
         { (props.idx === 0 && props.type === 'multi') &&
            <div className={classes.first_title}>
               <Typography variant='caption'>
                  Головне фото
               </Typography>
            </div>
         }

         <div className={cls.join(' ')}>
            <div className={classes.item_action_container}>
               { renderBtns() }
            </div>

            <div className={classes.item_img_wrapper}>
               { (imgSrc === 'loading' || imgLoading) &&
                  <div className={classes.item_img_loader}>
                     <Loader/>
                  </div>
               }

               <img src={imgSrc} alt=""/>
            </div>
         </div>
      </Grid>
   )
}

export default ImgItem