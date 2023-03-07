import {useCallback, useEffect, useState} from "react";
import {IAuthHook, ILoginFunction, ILogoutFunction} from "../../types/authTypes";
import useHttp from "./useHttp";

const useAuth: IAuthHook = () => {

   const { requestJson } = useHttp()

   const [isAuth, setIsAuth] = useState(false)
   const [token, setToken] = useState('')
   const [email, setEmail] = useState('')

   const login = useCallback<ILoginFunction>(async (email, password) => {
      return {}
   }, [])

   const logout = useCallback<ILogoutFunction>(async () => {
      return true
   }, [])

   useEffect(() => {
      (async () => {
         const localJson = localStorage.getItem('auth_novator')

         if (localJson) {
            const { email, token } = JSON.parse(localJson)

            const res = await requestJson('/api/au')
         }
      })()
   }, [])

   return { isAuth, token, email, login, logout }
}

export default useAuth