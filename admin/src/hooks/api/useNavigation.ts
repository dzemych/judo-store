import {useCallback, useEffect, useState} from "react"
import {ICardItem} from "src/types/cardTypes"
import useHttp, {METHOD} from "./useHttp";


type IUseNavigation = (limit: number, initParams?: string ) => {
   page: number
   pagesCount: number
   elements: ICardItem[]
   nextPageHandler: () => void
   prevPageHandler: () => void
   loading: boolean
   changeParams: (params: any) => void
}

const useNavigation: IUseNavigation = (limit, initParams) => {
   const [page, setPage] = useState(1)
   const [elements, setElements] = useState<ICardItem[]>([])
   const [params, setParams] = useState(initParams)
   const { requestJson, loading } = useHttp()

   const [pagesCount, setPagesCount] = useState(0)

   const changeElements = useCallback((initArr: any[], start: number, colLength: number) => {
      setElements(initArr)
      setPagesCount(Math.ceil(colLength / limit))
   }, [limit])

   const fetchElements = useCallback(async () => {
      let startIdx = ((page - 1) * limit)
      if (startIdx < 0) startIdx = 0

      const select = `select=-backPhoto,-_id,-photos,-content,-mediaLinks`

      const res = await requestJson(
         `/api/product?limit=${limit}&page=${page}${params}&${select}`,
         METHOD.get
      )

      if (res.items)
         changeElements(res.items, startIdx, res.colLength)
   }, [page, params, changeElements, limit, requestJson])

   const changeParams = useCallback((paramsObj: any) => {
      const paramsStr = Object.keys(paramsObj).reduce((acc, key) => {
         acc = `${acc}&${key}=${paramsObj[key]}`
         return acc
      }, '')

      setParams(paramsStr)
   }, [])

   const nextPageHandler = () => {
      if (page < pagesCount)
         setPage(prev => prev + 1)
   }

   const prevPageHandler = () => {
      if (page > 1)
         setPage(prev => prev - 1)
   }

   // 1) Load initial elements
   useEffect(() => {
      fetchElements()
   }, [page, params, fetchElements])

   // 2) Scroll to top on page change
   useEffect(() => {
      document.getElementById('main-root')?.scrollTo(0, 0)
   }, [page])

   return {
      page,
      pagesCount,
      elements,
      nextPageHandler,
      prevPageHandler,
      loading,
      changeParams
   }
}

export default useNavigation