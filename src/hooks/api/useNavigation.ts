import {useCallback, useContext, useEffect, useState} from "react"
import {IArticleCard} from "../../types/content/article"
import useHttp from "./useHttp"
import {NavigationHook} from "../../types/IUseNavigation"
import {FetchStatus} from "../../types/status"
import {useAppSelector} from "../useRedux"


const useNavigation: NavigationHook = (limit) => {
   const vw = useAppSelector(state => state.mediaReducer.vw)
   const { requestJson, loading } = useHttp()

   const [page, setPage] = useState(1)
   const [elements, setElements] = useState<IArticleCard[]>([])
   const [status, setStatus] = useState(FetchStatus.INIT)

   const [pagesCount, setPagesCount] = useState(0)

   const getProperElements = (arr: any[]) => {
      if (!arr.length) return []

      return arr
   }

   const setCurPageElements = useCallback(async () => {
      const select = '-content,-photos'

      let teamFilter = ''

      const url = `/api/product?limit=${limit}&page=${page}&select=${select}${teamFilter}`

      const res = await requestJson(url)

      if (res && res.items && res.items.length) {

         setElements(prev => {
            const x = getProperElements(res.items)

            return [...prev, ...x]
         })

         const pages = res.colLength / limit
         setPagesCount(Math.ceil(pages))

         setStatus(FetchStatus.LOADED)
      } else
         setStatus(FetchStatus.NO_DATA)
   }, [limit, page])

   // 1) Load initial elements
   useEffect(() => {
      if (vw)
         setCurPageElements()
   }, [setCurPageElements, vw])

   const loadMore = () => {
      setPage(prev => prev + 1)
   }

   return {
      page,
      pagesCount,
      elements,
      loading,
      loadMore,
      status
   }
}

export default useNavigation