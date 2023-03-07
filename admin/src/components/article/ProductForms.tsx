import React, {FC, useState, useRef, useEffect} from 'react'
import Box from '@mui/material/Box'
import {Grid, Typography} from '@mui/material'
import { Dayjs } from 'dayjs'
import Editor from "../forms/Editor/Editor"
import ImgInput from '../ImgInput/ImgInput'
import GridInputContainer from '../UI/GridInputContainer'
import DatePicker from '../UI/DatePicker'
import useFormsState from "../../hooks/useFormsState"
import {ProductState} from "../../types/collectionTypes"
import {ItemFormProps} from "../../types/formPropsTypes"
import {ITextInput} from "../../types/textInputTypes"
import TextInputs from "../forms/TextInputs"
import ActionBtns from "../forms/ActionBtns"
import FormsLayout from "../forms/FormsLayout"
import usePhotosState from '../../hooks/usePhotosState'
import { ObjStrKeys } from '../../types/formsStateTypes'


type IHandleDate = (newValue: Dayjs | null) => void

const initialState: ProductState = {
   mainPhoto: null,
   title: '',
   afterTitle: '',
   beforeTitle: '',
   text: '',
   date: null,
   content: '',
   photos: [],
   price: 0
}

const ProductForms: FC<ItemFormProps> = (
   {
      item = initialState,
      submitHandler,
      deleteHandler
   }) => {

   const editorContainerRef = useRef<HTMLElement>()

   const {
      formsState,
      handleFormsChange,
      isValid,
      formErrors,
      getFilteredState,
      formsLoading,
   } = useFormsState(initialState, item)
   const {
      photos,
      changePhotosHandler,
      deletePhotosHandler,
      nextPhotoHandler,
      prevPhotoHandler,
      firstPhotoHandler,
      photosError,
      photosLoading
   } = usePhotosState(item?.photos ? item.photos : [])
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [isAllValid, __] = useState(true)

   const inputs: ITextInput[] = [
      {
         key: 'title',
         label: 'Заголовок*',
         helperText: 'Заголовок має бути унікальним та містити мінімум 2 символи',
         error: formErrors.title ,
         value: formsState.title,
         changeHandler: handleFormsChange('title')
      },
      {
         label: 'Price*',
         helperText: '',
         key: 'price',
         error: formErrors.price,
         value: formsState.price,
         changeHandler: handleFormsChange('price'),
         type: 'number'
      },
      {
         key: 'text',
         label: 'Опис',
         helperText: '',
         error: formErrors.text,
         value: formsState.text,
         changeHandler: handleFormsChange('text')
      },
      {
         label: 'Текст після заголовку',
         helperText: '',
         key: 'afterTitle',
         error: formErrors.afterTitle,
         value: formsState.afterTitle,
         changeHandler: handleFormsChange('afterTitle')
      }
   ]

   const handleDateChange: IHandleDate = (newValue) => {
      handleFormsChange('date')(undefined, newValue)
   }

   const onSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault()

      // Check if forms are filled properly
      const formsValid = await isValid()

      if (formsValid) {
         const data: ObjStrKeys = getFilteredState(item)

         if (photos.length > 0)
            data.photos = photos

         if (data.price)
            data.price = parseFloat(data.price)

         await submitHandler(JSON.stringify(data))
      }

      document.getElementById('main-root')?.scrollTo(0, 125)
   }

   useEffect(() => {
      if (!isAllValid) {
         if (formErrors.mainPhoto || formErrors.title) {
            document.getElementById('main-root')?.scrollTo(0, 120)
         } else {
            document.getElementById('editor-container')?.scrollIntoView()
         }
      }
   }, [formErrors, isAllValid])

   return (
      <FormsLayout>
         <>
            <Grid container>
               <GridInputContainer key='img-input'>
                  <ImgInput
                     label='Головне фото запису*'
                     changeHandler={val => { handleFormsChange('mainPhoto')(undefined, val) }}
                     deleteHandler={() => { handleFormsChange('mainPhoto')(undefined, null) }}
                     error={formErrors.mainPhoto}
                     state={formsState.mainPhoto}
                  />
               </GridInputContainer>

               <TextInputs inputs={inputs}/>

               <GridInputContainer key='date-picker'>
                  <DatePicker
                     title={"Оберіть дату поста"}
                     value={formsState.date ? formsState.date : null}
                     handleChange={handleDateChange}
                  />
               </GridInputContainer>
            </Grid>

            <Box
               id={'editor-container'}
               ref={editorContainerRef}
               style={{
                  margin: '0 auto 10px',
                  width: '100%',
                  maxWidth: '100%'
               }}
            >
               <Typography variant='h5' gutterBottom>
                  Тіло запису*
               </Typography>

               <Editor
                  error={formErrors.content}
                  state={formsState.content}
                  changeHandler={handleFormsChange('content')}
               />
            </Box>

            <Grid container>
               <GridInputContainer id={'photos-input'}>
                  <ImgInput
                     label='Фотографії запису'
                     helperText={'Додайте хоча б два фото'}
                     deleteHandler={deletePhotosHandler}
                     changeHandler={changePhotosHandler}
                     prevHandler={prevPhotoHandler}
                     nextHandler={nextPhotoHandler}
                     firstHandler={firstPhotoHandler}
                     error={photosError}
                     state={photos}
                     multiple={true}
                  />
               </GridInputContainer>
            </Grid>

            <ActionBtns
               disabled={formsLoading && photosLoading}
               onSubmit={onSubmit}
               deleteHandler={deleteHandler}
            />
         </>
      </FormsLayout>
   )
}

export default ProductForms