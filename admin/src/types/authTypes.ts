
export type ILoginFunction = (email: string, password: string) => Promise<any> | any
export type ILogoutFunction = () => Promise<any> | any

export interface IAuthContext {
   isAuth: boolean
   token: string
   email: string
   login: ILoginFunction
   logout: ILogoutFunction
}

export type IAuthHook = () => {
   isAuth: boolean
   token: string
   email: string
   login: ILoginFunction
   logout: ILogoutFunction
}