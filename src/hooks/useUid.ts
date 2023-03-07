import {useCallback, useMemo} from "react"


type IHook = () => { v1: string, getV1: () => string }

const useUid: IHook = () => {

   const getV1 = useCallback(() => {
      return Math.floor(Math.random() * 1000000).toString()
   }, [])

   const v1 = useMemo(() => {
      return getV1()
   }, [])

   return { v1, getV1 }
}

export default useUid