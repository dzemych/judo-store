import useHttp, {METHOD} from "./useHttp"
import {useCallback} from "react"
import {
   ICheckDataExists,
   ICreateDataRequest,
   IDataApiHook,
   IGetOneDataRequest,
   IUpdateDataRequest
} from "../../types/crudApiTypes"


const useDataApi: IDataApiHook = (dataType) => {
   const { loading, requestJson, error, clearError } = useHttp()

   const updateData: IUpdateDataRequest = useCallback(async (formData) => {
      return await requestJson(
         `/api/data/${dataType}`,
         METHOD.patch,
         formData
      )
   }, [requestJson, dataType])

   const createData: ICreateDataRequest = useCallback(async (formData) => {
      return await requestJson(
         `/api/data/${dataType}`,
         METHOD.post,
         formData
      )
   }, [requestJson, dataType])

   const getData: IGetOneDataRequest = useCallback(async () => {
      return await requestJson(`/api/data/${dataType}`)
   }, [requestJson, dataType])

   const checkDataExists: ICheckDataExists = useCallback(async () => {
      const res = await requestJson(`/api/data/check/${dataType}`)
      return res.exist
   }, [requestJson, dataType])

   return { updateData, createData, getData, checkDataExists, clearError, error, loading }
}

export default useDataApi