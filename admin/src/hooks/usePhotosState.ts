import {useContext, useEffect, useState} from "react";
import TempImgContext from "../context/tempImgContext";
import RecordContext from "../context/recordContext";


type IProps = (initialState?: Array<string>) => {
   photos: Array<string>
   changePhotosHandler: (files: FileList) => void
   deletePhotosHandler: (idx: number) => void
   nextPhotoHandler: (idx: number) => void
   prevPhotoHandler: (idx: number) => void
   firstPhotoHandler: (idx: number) => void
   isValidPhotos: () => boolean
   photosError: boolean
   photosLoading: boolean
}

const usePhotosState: IProps = (initialPhotosState = []) => {

   const { recordType } = useContext(RecordContext)
   const { uploadTempImg, loading } = useContext(TempImgContext)

   const [photos, setPhotos] = useState(() => {
      if (recordType === 'create') {
         const savedVal = localStorage.getItem(`product_photos`)

         if (savedVal)
            return JSON.parse(savedVal) as typeof initialPhotosState
      }

      return initialPhotosState
   })
   const [photosError, setPhotosError] = useState(false)

   const getPhotoPromises = (files: File[]) => {
      return files.map(el => {

         return uploadTempImg(el)
      })
   }

   const uploadPhotos = async (files: File[]) => {
      const photoPromises = getPhotoPromises(files)
      const loadingArr = files.map(() => 'loading')
      const initLength = photos.length

      await setPhotos(prev => [...prev, ...loadingArr])

      for (const i in photoPromises) {
         const url = await photoPromises[i]
         const idx = parseInt(i) + initLength

         await setPhotos(prev => prev.map((el, index) => {
            if (index === idx) return url as string

            return el
         }))
      }
   }

   const changePhotosHandler = (files: FileList) => {
      if (files instanceof FileList) {
         const filesArr = Array.from(files)

         uploadPhotos(filesArr)
      }
   }

   const deletePhotosHandler = (idx: number) => {
      setPhotos(prev => prev.filter((el, i) => i !== idx))
   }

   const nextPhotoHandler = (idx: number) => {
      if (idx < photos.length - 1)
         setPhotos(prev => prev.map((el, i) => {
            if (i === idx)
               return prev[idx + 1]

            if (i === idx + 1)
               return prev[idx]

            return el
         }))
   }

   const prevPhotoHandler = (idx: number) => {
      if (idx >= 1)
         setPhotos(prev => prev.map((el, i) => {
         if (idx < 1)
            return el

         if (i === idx)
            return prev[idx - 1]

         if (i === idx - 1)
            return prev[idx]

         return el
      }))
   }

   const firstPhotoHandler = (idx: number) => {
      if (idx !== 0)
         setPhotos(prev => [...prev.splice(idx, 1), ...prev])
   }

   const isValidPhotos = () => {
      if (photos.length < 2) {
         setPhotosError(true)
         return false
      } else {
         setPhotosError(false)
         return true
      }
   }

   useEffect(() => {
      if (recordType === 'create')
         window.localStorage.setItem('product_photos', JSON.stringify(photos))
   }, [photos, recordType])

   return {
      photos,
      changePhotosHandler,
      deletePhotosHandler,
      nextPhotoHandler,
      prevPhotoHandler,
      firstPhotoHandler,
      isValidPhotos,
      photosError,
      photosLoading: loading,
   }
}

export default usePhotosState