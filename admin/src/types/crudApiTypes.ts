import {DataTypes} from "./dataTypes";


export type IUpdateArticleRequest = (id: string | undefined, formData: FormData | string) => any
export type ICreateArticleRequest = (formData: FormData | string) => any
export type IGetOneArticleRequest = (id: string | undefined) => any
export type IDeleteArticleRequest = (id: string) => Promise<boolean>

export type IUpdateDataRequest = (formData: FormData) => any
export type ICreateDataRequest = (formData: FormData) => any
export type IGetOneDataRequest = () => any
export type ICheckDataExists = () => Promise<boolean>

export type IItemApiHook = () => {
   updateItem: IUpdateArticleRequest,
   createItem: ICreateArticleRequest,
   getOneItem: IGetOneArticleRequest,
   deleteItem: IDeleteArticleRequest,
   clearError: () => void,
   error: string | null,
   loading: boolean
}

export type IDataApiHook = (dataType: DataTypes) => {
   createData: ICreateDataRequest,
   updateData: IUpdateDataRequest,
   getData: IGetOneDataRequest,
   checkDataExists: ICheckDataExists,
   clearError: () => void,
   error: string | null,
   loading: boolean
}