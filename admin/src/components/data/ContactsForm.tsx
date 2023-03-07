import React, {FC, useMemo} from "react"
import useFormsState from "../../hooks/useFormsState"
import {ITextInput} from "../../types/textInputTypes"
import FormsLayout from "../forms/FormsLayout"
import {Grid} from "@mui/material"
import TextInputs from "../forms/TextInputs"
import ActionBtns from "../forms/ActionBtns"
import {DataFormProps} from "../../types/formPropsTypes"
import {ContactsState} from "../../types/collectionTypes"
import GridInputContainer from "../UI/GridInputContainer";
import useTelState from "../../hooks/useTelState";
import TelInput from "../forms/TelInput";


export interface ITelInput {
   val: string
   error: boolean | undefined
   first: boolean
   onChange: (val: string) => void
   addOne: () => void
   deleteOne: () => void
}

const initialState: ContactsState = {
   tel: '+380',
   email: '',
   instagram: '',
   facebook: '',
   viber: '',
   address: '',
   location: undefined
}

const initialTels = ['']

const ContactForms: FC<DataFormProps> = ({ item, submitHandler, dataType }) => {
   const {
      formsState,
      handleFormsChange,
      getFilteredState,
      formsLoading
   } = useFormsState(initialState, item)
   const {
      telState,
      handleTelChange,
      addOneTel,
      deleteOneTel,
      telStateErrors,
      isValidTelState
   } = useTelState(item?.tels ? item.tels : initialTels)

   const onSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault()

      const formData = new FormData()

      const filteredForms = getFilteredState(item)
      filteredForms._id = dataType

      const isTel = isValidTelState()

      if (!isTel) {
         document.getElementById('main-root')?.scrollTo(0, 120)
      } else {
         filteredForms.tels = telState
         formData.append('data', JSON.stringify(filteredForms))
         await submitHandler(formData)
      }
   }

   const telInputs: ITelInput[] = useMemo(() => {
      return telState.map((el, i) => ({
         val: telState[i],
         error: telStateErrors[i],
         first: i === 0,
         addOne: addOneTel,
         deleteOne: deleteOneTel(i),
         onChange: handleTelChange(i)
      }))
   // eslint-disable-next-line
   }, [telState.length])

   const renderTelInputs = () => (
      telInputs.map((el, i) => (
         <TelInput
            key={i}
            val={telState[i]}
            error={telStateErrors[i]}
            onChange={handleTelChange(i)}
            onDelete={deleteOneTel(i)}
            addOne={addOneTel}
            first={i === 0}
         />
      ))
   )

   const inputs: ITextInput[] = [
      {
         key: 'email',
         label: 'Імейл',
         value: formsState.email,
         changeHandler: handleFormsChange('email')
      },
      {
         key: 'instagram',
         label: 'Інстаграм',
         value: formsState.instagram,
         changeHandler: handleFormsChange('instagram')
      },
      {
         key: 'viber',
         label: 'Вайбер',
         value: formsState.viber,
         changeHandler: handleFormsChange('viber')
      },
      {
         key: 'facebook',
         label: 'Фейсбук',
         value: formsState.facebook,
         changeHandler: handleFormsChange('facebook')
      },
      {
         key: 'address',
         label: 'Адреса',
         value: formsState.address,
         changeHandler: handleFormsChange('address')
      }
   ]

   return <FormsLayout >
      <>
         <Grid container>
            <GridInputContainer>
               { renderTelInputs() }
            </GridInputContainer>

            <TextInputs inputs={inputs}/>
         </Grid>

         <ActionBtns
            onSubmit={onSubmit}
            disabled={formsLoading}
         />
      </>
   </FormsLayout>
}

export default ContactForms