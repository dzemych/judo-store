import {useCallback, useMemo} from "react"


type IHook = () => {
   v1: string
   v2: string
   getV1: () => string
   getV2: () => string
}

const useUid: IHook = () => {
   const getV1 = useCallback(() =>
      `${Math.floor(Math.random() * 1000000)}`
      , [])

   const getV2 = useCallback(() =>
      `${Math.floor(Math.random() * 1000000)}-${Date.now()}`
      , [])

   const v1 = useMemo(() => getV1(), [getV1])
   const v2 = useMemo(() => getV2(), [getV2])

   return { v1, v2, getV2, getV1 }
}

export default useUid