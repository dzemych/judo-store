import {DataType} from "../../types/content/data"
import {useCallback, useEffect, useState} from "react"
import useHttp from "./useHttp"
import {FetchStatus} from "../../types/status"


type IHook = (dataType: DataType) => {
   data: any
   status: FetchStatus
}

const useDataState: IHook = (cardType) => {
   const { requestJson } = useHttp()

   const [status, setStatus] = useState(FetchStatus.INIT)
   const [data, setData] = useState(null)

   const fetchData = useCallback(async () => {
      const res = await requestJson('/api/data/' + cardType)

      if (res && res.item) {
         setData(res.item)
         setStatus(FetchStatus.LOADED)
      } else {
         setStatus(FetchStatus.NO_DATA)
      }
   }, [])

   useEffect(() => {
      if (cardType)
         fetchData()
   }, [cardType, fetchData])

   return { status, data }
}

export default useDataState