import {IPersonState} from "../../types/content/person"
import {useCallback, useEffect, useState} from "react"
import useHttp from "./useHttp"
import {FetchStatus} from "../../types/status"


type IHook = (slug: string) => {
   item: IPersonState | null
   status: FetchStatus
}

const usePersonState: IHook = (slug) => {
   const { requestJson } = useHttp()

   const [item, setItem] = useState<null | IPersonState>(null)
   const [status, setStatus] = useState(FetchStatus.INIT)

   const fetchItem = useCallback(async () => {
      if (slug) {
         const res = await requestJson('/api/team/' + slug)

         if (res && res.item) {
            setItem(res.item)
            setStatus(FetchStatus.LOADED)
         } else {
            setStatus(FetchStatus.NO_DATA)
         }
      }

   }, [slug])

   useEffect(() => {
      fetchItem()
   }, [fetchItem])

   return { item, status }
}

export default usePersonState