import {useState, useCallback} from "react";
import axios from 'axios'


export enum METHOD {
   get = 'GET',
   post = 'POST',
   patch = 'PATCH',
   delete = 'DELETE',
   option = 'OPTION',
}

type IHook = () => {
   loading: boolean
   error: string | null
   requestJson: IRequestJson
   clearError: () => void
}

type IRequestJson = (url: string, method?: METHOD, body?: any, props?: any) => any

const useHttp: IHook = () => {
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const clearError = () => {
      setError(null)
   }

   const requestJson: IRequestJson = useCallback(async (
      url,
      method = METHOD.get,
      body,
      props
   ) => {
      setLoading(true)

      try {
         const res = await axios({ method, url, data: body, ...props })

         return res.data
      } catch(e: any) {
         setError(e.response.data.message)
         return null
      } finally {
         setLoading(false)
      }
   }, [])

   return { loading, error, requestJson, clearError }
}

export default useHttp