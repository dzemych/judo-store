import {FetchStatus} from "../../types/status"
import {useEffect, useState} from "react"


type IHook = (photoSrc: string) => {
   fetchStatus: FetchStatus
}

const usePhotoFetchStatus: IHook = (photoSrc) => {
   const [status, setStatus] = useState(FetchStatus.INIT)

   useEffect(() => {
      const newImg = new Image()

      newImg.onload = () => { setStatus(FetchStatus.LOADED) }
      newImg.src = photoSrc

      if (!photoSrc)
         setStatus(FetchStatus.NO_DATA)
   }, [photoSrc])

   return { fetchStatus: status }
}

export default usePhotoFetchStatus