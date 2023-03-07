import React, {FC} from "react"
import useFormsState from "../../hooks/useFormsState"
import usePhotosState from "../../hooks/usePhotosState"
import ActionBtns from "../forms/ActionBtns"
import {DataFormProps} from "../../types/formPropsTypes"
import {HallState} from "../../types/collectionTypes"
import {ITextInput} from "../../types/textInputTypes"
import TextInputs from "../forms/TextInputs"
import {Grid} from "@mui/material"
import FormsLayout from "../forms/FormsLayout"
import ImgInput from "../ImgInput/ImgInput"
import GridInputContainer from "../UI/GridInputContainer"


const initialState: HallState = {
   address: "",
   mainPhoto: null,
   photos: [],
   title: '',
   text: ''
}

const HallForms: FC<DataFormProps> = ({ item, submitHandler, dataType }) => {
   const {
      formsState,
      handleFormsChange,
      formErrors,
      getFilteredState,
      formsLoading
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

   const onSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault()

      const filteredForms = getFilteredState(item)

      filteredForms._id = dataType
      filteredForms.photos = photos

      const formData = new FormData()
      formData.append('data', JSON.stringify(filteredForms))

      await submitHandler(formData)
   }

   const inputs: ITextInput[] = [
      {
         key: 'address',
         label: 'Адреса*',
         value: formsState.address,
         changeHandler: handleFormsChange('address')
      },
      {
         key: 'text',
         label: 'Опис',
         value: formsState.text,
         changeHandler: handleFormsChange('text'),
         multiline: true
      },
   ]

   return <FormsLayout >
      <>
         <Grid container>
            <GridInputContainer>
               <ImgInput
                  label='Головне фото запису*'
                  changeHandler={val => { handleFormsChange('mainPhoto')(undefined, val) }}
                  deleteHandler={() => { handleFormsChange('mainPhoto')(undefined, null) }}
                  error={formErrors.mainPhoto}
                  state={formsState.mainPhoto}
               />
            </GridInputContainer>

            <TextInputs inputs={inputs}/>

            <GridInputContainer id={'photos-input'}>
               <ImgInput
                  label='Фотографії залу'
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
            onSubmit={onSubmit}
            disabled={formsLoading || photosLoading}
         />
      </>
   </FormsLayout>
}

export default HallForms