import {IArticleState} from "../../types/content/article"
import useHttp from "./useHttp"
import {useCallback, useEffect, useState} from "react"
import {FetchStatus} from "../../types/status"


type IHook = (slug: string) => {
   fetchItem: (slug: string) => void
   item: IArticleState | null
   loading: boolean
   error: null | string
   status: FetchStatus
}

const useProductState: IHook = (slug) => {
   const { requestJson, loading, error } = useHttp()
   const [status, setStatus] = useState(FetchStatus.INIT)

   const [item, setItem] = useState<IArticleState | null>(null)

   const refreshItem = () => {
      setStatus(FetchStatus.INIT)
   }

   const fetchItem = useCallback(async (id: string) => {
      const res = await requestJson(`/api/product/${id}`)

      if (res && res.item) {
         setItem(res.item)
         setStatus(FetchStatus.LOADED)
      } else {
         setStatus(FetchStatus.NO_DATA)
      }
   }, [])

   useEffect(() => {
      if (slug && status === FetchStatus.INIT)
         fetchItem(slug)
   }, [fetchItem, status, slug])

   return { item, fetchItem: refreshItem, error, loading, status }
}

export default useProductState