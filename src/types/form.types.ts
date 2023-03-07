import {ObjWithStrKeys} from "./global.types"


export interface ITextInput {
   value: string
   onChange: (val: string) => void
   onSubmit: () => void
   error?: '' | null
   title: string
   placeholder?: string
}

export interface IOrderState extends ObjWithStrKeys{
   name: string
   surname: string
   tel: string
   email: string
   country: string
   city: string
   street: string
   floor: string
   flat: string
   postalCode: string
}