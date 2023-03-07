import {ObjWithStrKeys} from "../types/global.types"
import {useState} from "react"
import useFormsValidator from "./useFormsValidator"


type IHook = <T extends ObjWithStrKeys>(initialState: T) => {
   state: T,
   changeState: (key: string) => (val: string) => void,
   errors: ObjWithStrKeys,
   checkValid: () => boolean
}

const useTextFormsState: IHook = (initialState) => {
   const { isEmail, isTel } = useFormsValidator()

   const [state, setState] = useState(initialState)
   const [errors, setErrors] = useState<ObjWithStrKeys>({})

   const changeState = (key: string) => (val: string) => {
      setState(prev => ({ ...prev, [key]: val }))
   }

   const isFieldValid = (key: string, value: string) => {
      switch (key) {
         case 'email':
            return isEmail(value)
         case 'tel':
            return isTel(value)
         default:
            return true
      }
   }

   const checkValid = () => {
      let allValid = true
      const newErrors: ObjWithStrKeys = {}

      for (const key in state) {
         const isValid = isFieldValid(key, state[key])

         newErrors[key] = isValid
         allValid = allValid && isValid
      }

      setErrors(newErrors)
      return allValid
   }

   return { state, changeState, checkValid, errors }
}

export default useTextFormsState