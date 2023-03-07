export type IUploadTempImg = (file: File) => Promise<string> | null
export type IDeleteTempImg = (url: string) => Promise<boolean> | null
export type IDeleteTempFolder = () => Promise<boolean> | null

export interface ITempImgContextState {
   uploadTempImg: IUploadTempImg
   deleteTempImg: IDeleteTempImg
   deleteTempFolder: IDeleteTempFolder
   uploadUrl: string
   loading: boolean
}