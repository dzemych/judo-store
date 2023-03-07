export enum HTTP_METHOD {
   get = 'GET',
   post = 'POST',
   patch = 'PATCH',
   delete = 'DELETE',
}

export type IRequestJson = (url: string, method?: HTTP_METHOD, body?: any,  headers?: any) => Promise<any>

export type IUseHttpHook = () => {
   loading: boolean
   error: string | null
   requestJson: IRequestJson
}