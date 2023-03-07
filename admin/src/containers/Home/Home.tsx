import React, {FC, useCallback, useEffect, useState} from "react"
import classes from './Home.module.sass'
import {Container, Grid, Typography} from "@mui/material"
import ImgInput from "../../components/ImgInput/ImgInput"
import Button from "@mui/material/Button"
import useHttp, {METHOD} from "../../hooks/api/useHttp"
import PopUpLoading from "../../components/PopUp/PopUpLoading"
import SuccessDataForm from "../../components/data/SuccessDataForm"
import {DataTypes} from "../../types/dataTypes"
import Loader from "../../components/UI/Loader"
import ImgContainer from "./ImgContainer"
import useTempImg from "../../hooks/api/useTempImg"
import TextField from "@mui/material/TextField"
import {IChangeInputEvent} from "../../types/textInputTypes"
import useMedia from "../../hooks/useMedia";


interface IItem {
   photo: string | null
   title: string
}

type IChangeHandler =
   (key: keyof typeof initialState) =>
      (val: FileList | IChangeInputEvent) =>
         Promise<void>

const itemState: IItem = {
   photo: null,
   title: ''
}

const initialState = {
   home: itemState,
   contacts: itemState,
   about: itemState,
   basket: itemState,
}

const pages = Object.keys(initialState)

const Home: FC = () => {

   const { isTablet } = useMedia()
   const { requestJson, loading } = useHttp()
   const { uploadTempImg } = useTempImg('data', 'update')

   const [state, setState] = useState(initialState)
   const [status, setStatus] = useState<'init' | 'loaded' | 'updated'>('init')

   const changeHandler: IChangeHandler = (key) => async (val) => {
      if (val instanceof FileList) {
         await setState(prev => ({
            ...prev,
            [key]: { ...prev[key], photo: 'loading' }
         }))

         const url = await uploadTempImg(val[0])

         if (url) {
            await setState(prev => ({
               ...prev,
               [key]: { ...prev[key], photo: url }
            }))
         }
      } else {
         setState(prev => ({
            ...prev,
            [key]: { ...prev[key], title: val.target.value }
         }))
      }
   }

   const deleteHandler = (key: string) => () => {
      setState(prev => ({ ...prev, [key]: itemState }))
   }

   const getPhotoTitle = (key: string) => {
      switch(key) {
         case 'home': return "Home"
         case 'contacts': return "Contacts"
         case 'about': return "About"
         case 'basket': return "Basket"
         default: return "Photo and title"
      }
   }

   const onSubmit = async () => {
      const formData = new FormData()

      formData.append('data', JSON.stringify(state))

      const res = await requestJson(
         '/api/data/' + DataTypes.PAGES_DATA,
         METHOD.patch,
         formData
      )

      if (res && res.ok)
         setStatus('updated')
   }

   const setToInitial = () => {
      setStatus('init')
   }

   const fetchItem = useCallback(async () => {
      const res = await requestJson('/api/data/' + DataTypes.PAGES_DATA)

      if (res)
         setState(res.item)

      setStatus('loaded')
   }, [requestJson])

   useEffect(() => {
      if (status === 'init')
         fetchItem()
   }, [status, fetchItem])

   if (status === 'init')
      return <Loader styles={{ marginTop: '20px' }}/>

   if (status === 'updated')
      return <SuccessDataForm
         status={status}
         setAllInitial={setToInitial}
         dataType={DataTypes.PAGES_DATA}
      />

   return (
      <Container className={classes.container} maxWidth="sm">
         <PopUpLoading isOpen={loading}/>

         <Typography
            className={classes.title}
            variant='h3'
            color='textPrimary'
            align='center'
         >
            Фото та надписи на задньому плані
         </Typography>

         <Grid
            container
            width={'100%'}
            spacing={isTablet ? 2 : 0}
            rowSpacing={!isTablet ? 2 : 0}
         >
            { pages.map((el) => {
               const key = el as keyof typeof state

               return (
                  <Grid key={el} item xs={12} md={6}>
                     <div className={classes.img_item}>
                        <Typography variant='h5' margin='0 auto 10px'>
                           {getPhotoTitle(el)}
                        </Typography>

                        <TextField
                           value={state[key].title}
                           onChange={changeHandler(key)}
                        />

                        <div className={classes.text_input_wrapper}>
                           <ImgInput
                              changeHandler={changeHandler(key)}
                              deleteHandler={deleteHandler(el)}
                              error={false}
                              label={''}
                              state={state[key].photo}
                              helperText={''}
                              photoPreview={false}
                           />
                        </div>

                        <ImgContainer url={state[key].photo}/>
                     </div>
                  </Grid>
               )
            }) }
         </Grid>

         <Button variant='contained' onClick={onSubmit} className={classes.submit_btn}>
            Оновити
         </Button>
      </Container>
   )
}

export default Home