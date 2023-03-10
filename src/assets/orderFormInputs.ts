import {IOrderState, ITextInput} from "../types/form.types"
import {ObjWithStrKeys} from "../types/global.types"


export const getInputs = (
   state: IOrderState,
   changeState: (key: string) => (val: string) => void,
   errors: ObjWithStrKeys,
   onSubmit: () => void
): ITextInput[] => (
   [
      {
         title: 'Your name',
         placeholder: 'Name',
         value: state.name,
         error: errors.name,
         onChange: changeState('name'),
         onSubmit
      },
      {
         title: 'Your surname',
         placeholder: 'Surname',
         value: state.surname,
         error: errors.surname,
         onChange: changeState('surname'),
         onSubmit
      },
      {
         title: 'Your email',
         placeholder: 'example@gmail.com',
         value: state.email,
         error: errors.email,
         onChange: changeState('email'),
         onSubmit
      },
      {
         title: 'Your phone number',
         placeholder: '+12 333 444 555',
         value: state.tel,
         error: errors.tel,
         onChange: changeState('tel'),
         onSubmit
      },
      {
         title: 'Country',
         placeholder: 'England',
         value: state.country,
         error: errors.country,
         onChange: changeState('country'),
         onSubmit
      },
      {
         title: 'City',
         placeholder: 'London',
         value: state.city,
         error: errors.city,
         onChange: changeState('city'),
         onSubmit
      },
      {
         title: 'Street',
         placeholder: 'Street 10/1',
         value: state.street,
         error: errors.street,
         onChange: changeState('street'),
         onSubmit
      },
      {
         title: 'floor',
         placeholder: '10',
         value: state.floor,
         error: errors.floor,
         onChange: changeState('floor'),
         onSubmit
      },
      {
         title: 'flat',
         placeholder: '1',
         value: state.flat,
         error: errors.flat,
         onChange: changeState('flat'),
         onSubmit
      },
      {
         title: 'Postal code',
         placeholder: '123-45',
         value: state.postalCode,
         error: errors.postalCode,
         onChange: changeState('postalCode'),
         onSubmit
      },
   ]
)