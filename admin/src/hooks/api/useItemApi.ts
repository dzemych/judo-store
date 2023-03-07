import useHttp, {METHOD} from "./useHttp"
import {useCallback} from "react"
import {ICreateArticleRequest, IDeleteArticleRequest, IGetOneArticleRequest, IItemApiHook, IUpdateArticleRequest} from "../../types/crudApiTypes";


const useItemApi: IItemApiHook = () => {
   const { loading, requestJson, error, clearError } = useHttp()

   const updateItem: IUpdateArticleRequest = useCallback(async (id, formData) => {
      const res = await requestJson(
         `/api/product/${id}`,
         METHOD.patch,
         formData,
         { headers: { 'Content-Type': 'application/json' }}
      )

      if (!res) return null

      return res.item.slug
   }, [requestJson])

   const createItem: ICreateArticleRequest = useCallback(async (formData) => {
      const res = await requestJson(
         `/api/product`,
         METHOD.post,
         formData,
         { headers: { 'Content-Type': 'application/json' }}
      )

      if (!res) return null

      return res.item.slug
   }, [requestJson])

   const getOneItem: IGetOneArticleRequest = useCallback(async (id) => {
      const res = await requestJson(`/api/product/${id}`, METHOD.get)

      if (!res) return null

      return res.item
   }, [requestJson])

   const deleteItem: IDeleteArticleRequest = useCallback(async (id) => {
      const res = await requestJson(`/api/product/${id}`, METHOD.delete)

      return !res
   }, [requestJson])

   return { updateItem, createItem, getOneItem, deleteItem, clearError, error, loading }
}

export default useItemApi