import {useCallback, useEffect, useState} from "react"
import {IArticleCard} from "../../types/content/article"
import useHttp from "./useHttp"
import {NavigationHook} from "../../types/IUseNavigation"
import {FetchStatus} from "../../types/status"


const useNavigation: NavigationHook = (limit) => {
   const { requestJson, loading } = useHttp()

   const [page, setPage] = useState(1)
   const [elements, setElements] = useState<IArticleCard[]>([])
   const [status, setStatus] = useState(FetchStatus.INIT)

   const [pagesCount, setPagesCount] = useState(0)

   const getProperElements = (arr: any[]) => {
      if (!arr.length) return []

      return arr
   }

   const fetchElements = useCallback(async () => {
      const select = '-content,-photos'

      let teamFilter = ''

      const url = `/api/product?limit=${limit}&page=${page}&select=${select}${teamFilter}`

      const res = await requestJson(url)

      if (res && res.items && res.items.length) {
         setElements(getProperElements(res.items))

         const pages = res.colLength / limit
         setPagesCount(Math.ceil(pages))

         setStatus(FetchStatus.LOADED)
      } else
         setStatus(FetchStatus.NO_DATA)
   }, [limit, page])

   // 1) Load initial elements
   useEffect(() => {
      fetchElements()
   }, [fetchElements])

   const nextPageHandler = () => {
      if (page < pagesCount)
         setPage(prev => prev + 1)
   }

   const prevPageHandler = () => {
      if (page > 1)
         setPage(prev => prev - 1)
   }

   return {
      page,
      pagesCount,
      elements,
      nextPageHandler,
      prevPageHandler,
      loading,
      status
   }
}

export default useNavigation