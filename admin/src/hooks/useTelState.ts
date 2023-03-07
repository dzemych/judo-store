import {ITelState, TelChangeHandler, TelStateHook} from "../types/formsStateTypes"
import {useState} from "react"
import {matchIsValidTel} from "mui-tel-input";


const useTelState: TelStateHook = (initialState) => {

   const [telState, setTelState] = useState<ITelState>(() => {
      if (!initialState)
         return ['+380']

      return initialState as ITelState
   })
   const [telStateErrors, setTelStateErrors] = useState<boolean[]>([])

   const handleTelChange: TelChangeHandler = (key) => (val) => {
      setTelState(prev => {
         const newState = [...prev]

         let newEl = val
         const numCount = val.split(' ').join('').split('').length

         if (numCount > 13)
            newEl = val.split('').slice(0, 14).join('')

         newState[key] = newEl

         return newState
      })
   }

   const isValidTelState = () => {
      let isValid = true
      const newErrors: boolean[] = []

      telState.forEach((el, i) => {
         if (!el || el.length < 6 || !matchIsValidTel(el)) {
            isValid = false
            newErrors[i] = true
         }
      })

      setTelStateErrors(newErrors)
      return isValid
   }

   const addOneTel = () => {
      setTelState(prev => [...prev, '+380'])
   }

   const deleteOneTel = (key: number) => () => {
      setTelState(prev => prev.filter((el, i) => i !== key))
   }

   return { telState, handleTelChange, isValidTelState, addOneTel, deleteOneTel, telStateErrors }
}

export default useTelState