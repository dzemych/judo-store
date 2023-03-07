import React, {FC} from "react"
import useFormsState from "../../hooks/useFormsState"
import {ITextInput} from "../../types/textInputTypes"
import FormsLayout from "../forms/FormsLayout"
import {Grid, Typography} from "@mui/material"
import TextInputs from "../forms/TextInputs"
import ActionBtns from "../forms/ActionBtns"
import {DataFormProps} from "../../types/formPropsTypes"
import {AboutState} from "../../types/collectionTypes"
import Editor from "../forms/Editor/Editor";
import Box from "@mui/material/Box";


const initialState: AboutState = {
   title: "",
   photos: [],
   content: '',
}

const AboutForms: FC<DataFormProps> = ({ item, submitHandler, dataType }) => {
   const {
      formsState,
      handleFormsChange,
      formErrors,
      getFilteredState,
      formsLoading
   } = useFormsState(initialState, item)

   const onSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault()

      const filteredForms = getFilteredState(item)
      filteredForms._id = dataType

      const formData = new FormData()
      formData.append('data', JSON.stringify(filteredForms))

      await submitHandler(formData)
   }

   const inputs: ITextInput[] = [
      {
         key: 'title',
         label: 'Заголовок*',
         value: formsState.title,
         changeHandler: handleFormsChange('title')
      }
   ]

   return <FormsLayout >
      <>
         <Grid container>
            <TextInputs inputs={inputs}/>
         </Grid>

         <Box style={{
            margin: '0 auto 10px',
            width: '100%',
            maxWidth: '100%'
         }}>
            <Typography variant='h5' gutterBottom>
               Тіло запису*
            </Typography>

            <Editor
               error={formErrors.content}
               state={formsState.content}
               changeHandler={handleFormsChange('content')}
            />
         </Box>

         <ActionBtns
            onSubmit={onSubmit}
            disabled={formsLoading}
         />
      </>
   </FormsLayout>
}

export default AboutForms