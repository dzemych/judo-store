import {useEffect, useState} from "react"
import useHttp from "./useHttp"
import {FetchStatus} from "../../types/status"


type IHook = (page: string) => {
   title: string
   backSrc: string
   status: FetchStatus
}

const usePageData: IHook = (page) => {
   const { requestJson } = useHttp()

   const [status, setStatus] = useState(FetchStatus.INIT)
   const [title, setTitle] = useState('')
   const [backSrc, setBackSrc] = useState('')

   useEffect(() => {
      (async () => {
         if (page) {
            const res = await requestJson('/api/data/pagesData/' + page)

            if (res && res.item) {
               setTitle(res.item.title)
               setBackSrc(res.item.backSrc)
            }

            setStatus(FetchStatus.LOADED)
         } else {
            setStatus(FetchStatus.LOADED)
         }
      })()
   }, [page, requestJson])

   return { title, backSrc, status }
}

export default usePageData