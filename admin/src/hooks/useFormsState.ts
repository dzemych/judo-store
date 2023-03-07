import {useContext, useEffect, useMemo, useState} from "react"
import TempImgContext from "../context/tempImgContext";
import RecordContext from "../context/recordContext";
import useFormsValidChecker from "./useFormsValidChecker";
import {FormsChangeHandler, FormsStateHook, ObjStrKeys} from "../types/formsStateTypes";


const useFormsState: FormsStateHook = (initialState, item) => {
   const { recordType } = useContext(RecordContext)

   const initialErrors = useMemo(() => {
      const obj = Object.keys(initialState).reduce((acc: ObjStrKeys, key) => {
         acc[key] = false
         return acc
      }, {})

      return obj as ObjStrKeys
   }, [initialState])

   const { uploadTempImg, loading: tempImgLoading } = useContext(TempImgContext)
   const [formsState, setFormsState] = useState<typeof initialState>(() => {
      if (recordType === 'create') {
         const val = window.localStorage.getItem('product')

         if (val)
            return JSON.parse(val) as typeof initialState
         else
            return initialState
      }

      if (!item) return initialState

      const obj = Object.keys(initialState).reduce((acc: ObjStrKeys, key) => {
         acc[key] = item[key]

         return acc
      }, {})

      return obj as typeof initialState
   })
   const [formErrors, setFormErrors] = useState(initialErrors)

   const { notEmpty, loading, checkFormsValid } = useFormsValidChecker(formsState)

   const isValid = async (): Promise<boolean> => {
      let isValid = true
      const newErrors: ObjStrKeys = {}

      const objKeys = Object.keys(formErrors)

      for (let i in objKeys) {
         const key = objKeys[i]

         const valid = await checkFormsValid(key, recordType)

         if (initialErrors.hasOwnProperty(key) && !valid) {
            isValid = false
            newErrors[key] = true
         }
      }

      setFormErrors(newErrors)

      return isValid
   }

   const handleMainPhotoChange = async (file: any) => {
      if (!file) {
         setFormsState(prev => ({...prev, mainPhoto: ''}))
         return
      }

      if (file instanceof FileList) {
         await setFormsState(prev => ({...prev, mainPhoto: 'loading'}))

         const formData = new FormData()
         formData.append('upload', file[0])

         const url = await uploadTempImg(file[0])
         if (url)
            setFormsState(prev => ({...prev, mainPhoto: url}))
      }

      if (typeof file === 'string')
         setFormsState(prev => ({...prev, mainPhoto: file}))
   }

   const handleFormsChange: FormsChangeHandler = key => (e , val) => {
      let newValue: string | undefined

      if (key === 'mainPhoto') {
         handleMainPhotoChange(val)
         return
      }

      if (val !== null && val !== undefined)
         newValue = val

      if (key === 'positionType')
         newValue = e?.target.value.toString()

      setFormsState(prev => {
         // 1) Check if phone is not too long, take only allowed count of numbers
         if (key === 'tel') {
            const numCount = val.split(' ').join('').split('').length

            if (newValue && numCount > 13)
               return {...prev, [key]: newValue.split('').slice(0, 14).join('')}
         }

         // 2) If trying to change nested fields change only necessary
         if (key.split('.').length === 2) {
            const keyArr = key.split('.')

            return {
               ...prev,
               [keyArr[0]]: {
                  ...prev[keyArr[0] as keyof typeof prev],
                  [keyArr[1]]: e?.target.value
               }
            }
         }

         // 3) If v is undefined set it to default target value
         if (newValue === undefined) {
            if (!e || !e.target || !e.target.value) {
               newValue = ''
            } else {
               newValue = e.target.value
            }
         }

         return { ...prev, [key]: newValue }
      })
   }

   const getFilteredState = (prevState?: any) => {
      return Object.keys(formsState).reduce((acc: ObjStrKeys, el) => {
         const key = el as string

         if (recordType === 'update' && prevState && formsState[key] === prevState[key])
            return acc

         if (!item)
            if (!notEmpty(key as string))
               return acc

         // Process media links field, to contain only filled
         if (key === "mediaLinks") {
            const obj = Object.keys(formsState[key]).reduce((acc: ObjStrKeys, el) => {
               const val = formsState[key][el]
               if (val)
                  acc[el] = val

               return acc
            }, {})

            const isNullObj = Object.keys(obj).length < 1
            if (!isNullObj)
               acc[key] = obj

            if (isNullObj && item && item[key])
               acc[key] = {}

            return acc
         }

         if (key === 'mainPhoto' && formsState.mainPhoto instanceof File)
            return acc

         if (key === 'tel' && formsState[key].length < 6)
            acc[key] = null

         // Process date from DateJs to normal Date type
         if (key === 'date') {
            if (!formsState.date) {
               acc[key] = 0
               return acc
            }

            acc[key] = formsState.date?.unix() * 1000
         } else
            acc[key] = formsState[key]

         return acc
      }, {})
   }

   const getFormData = (prevState?: any) => {
      // State with only filled fields
      const filteredState = getFilteredState(prevState)

      const formData = new FormData()
      formData.append('data', JSON.stringify(filteredState))

      if (formsState.mainPhoto instanceof File)
            formData.append('upload', formsState.mainPhoto)

      return formData
   }

   useEffect(() => {
      if (recordType === 'create')
         window.localStorage.setItem('product', JSON.stringify(formsState))
   }, [formsState, recordType])

   return {
      formsState,
      handleFormsChange,
      isValid,
      formErrors,
      getFormData,
      getFilteredState,
      formsLoading: loading || tempImgLoading
   }
}

export default useFormsState