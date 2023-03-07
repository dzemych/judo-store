import { useCallback, useState } from 'react'
import {HTTP_METHOD, IRequestJson, IUseHttpHook} from "../../types/IUseHttp"


const useHttp: IUseHttpHook = () => {
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<null | string>(null)

   const requestJson = useCallback<IRequestJson>(async (
      url,
      method = HTTP_METHOD.get,
      body = null,
      headers
   ) => {
      setLoading(true)

      try {
         const res = await fetch(url, { method, body, headers })

         return await res.json()
      } catch(e: any) {
         setError(e.message)
         return null
      } finally {
         setLoading(false)
      }
   }, [])

   return { requestJson, loading, error }
}

export default useHttp