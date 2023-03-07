import {matchIsValidTel} from "mui-tel-input";
import useHttp from "./api/useHttp";
import {
   CheckFunction,
   CheckFunctionWithKey,
   IsValidFunction,
   UniqueCheckFunction,
   ValidCheckerHook
} from "../types/validCheckerTypes";


export const useFormsValidChecker: ValidCheckerHook = (formsState) => {
   const { requestJson, loading } = useHttp()

   const longerThanTwo: CheckFunctionWithKey = (key: string) => {
      const el = formsState[key as keyof typeof formsState] as string
      return el.length >= 2
   }

   const notEmpty: CheckFunction = (key?: string) => {
      const val = formsState[key as keyof typeof formsState]

      return (
         val !== undefined &&
         val !== null &&
         val !== ''
      )
   }

   const isUnique: UniqueCheckFunction = async (key, recordType) => {
      if (recordType === 'create') {
         const res = await requestJson(
            `/api/product?${key}=${formsState[key as keyof typeof formsState]}`
         )

         return res.results < 1
      }
      return true
   }

   const isEmail: CheckFunction = () => {
      if ('email' in formsState) {
         if (!formsState.email)
            return true

         return !!(formsState.email.toLowerCase()
            .match(
               /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ))
      }

      return true
   }

   const isPhone: CheckFunction = () => {
      if (!formsState.tel)
         return true

      if (formsState.tel.length < 6)
         return true

      return matchIsValidTel(formsState.tel)
   }

   const titleCheck: CheckFunctionWithKey = (key: string) => {
      const el = formsState[key as keyof typeof formsState] as string
      return el.trim() !== 'new'
   }

   const checkFormsValid: IsValidFunction = async (key: string, recordType) => {
      switch(key) {
         case 'title':
            return longerThanTwo(key) && await isUnique(key, recordType) && titleCheck(key)

         case 'content':
            return notEmpty(key)

         case 'mainPhoto':
            return notEmpty(key)

         case 'position':
            return longerThanTwo(key)

         case 'name':
            return longerThanTwo(key)

         case 'surname':
            return longerThanTwo(key)

         case 'email':
            return isEmail()

         case 'tel':
            return isPhone()

         case 'address':
            return longerThanTwo(key)

         default: return true
      }
   }

   return {
      longerThanTwo,
      notEmpty,
      isEmail,
      isPhone,
      isUnique,
      titleCheck,
      loading,
      checkFormsValid
   }
}

export default useFormsValidChecker