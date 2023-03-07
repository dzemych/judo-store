import React, {FC, JSXElementConstructor, ReactElement, useCallback, useEffect, useState} from "react";
import useTempImg from "../../hooks/api/useTempImg";
import useDataApi from "../../hooks/api/useDataApi";
import {DataTypes} from "../../types/dataTypes";
import {Typography} from "@mui/material";
import TempImgContext from "../../context/tempImgContext";
import useUid from "../../hooks/useUid";
import SuccessDataForm from "./SuccessDataForm";
import Button from "@mui/material/Button";
import Loader from "../UI/Loader";
import PopUpLoading from "../PopUp/PopUpLoading";


interface IProps {
   dataType: DataTypes,
   children: ReactElement<any, string | JSXElementConstructor<any>>
   title: string
}

const DataBase: FC<IProps> = ({dataType, title, children}) => {

   const {
      createData,
      updateData,
      getData,
      loading: itemLoading,
      checkDataExists
   } = useDataApi(dataType)
   const {
      uploadTempImg,
      deleteTempImg,
      uploadUrl,
      deleteTempFolder,
      loading: tempImgLoading
   } = useTempImg('data', 'update')

   const {getV1} = useUid()
   const [editorKey, setEditorKey] = useState(getV1())
   const [status, setStatus] = useState<'init' | 'loaded' |'created' | 'updated'>('init')
   const [item, setItem] = useState(null)

   const fetchData = useCallback(async () => {
      const res = await getData()

      setItem(res ? res.item : null )
      setStatus('loaded')
   }, [getData])

   const updateDataHandler = async (formData: FormData) => {
      const res = await updateData(formData)

      if (res)
         setStatus('updated')
   }

   const createDataHandler = async (formData: FormData) => {
      const res = await createData(formData)

      if (res)
         setStatus('created')
   }

   const submitHandler = async (formData: FormData) => {
      const exist = await checkDataExists()

      if (exist)
         await updateDataHandler(formData)
      else
         await createDataHandler(formData)
   }

   const setToInitial = () => {
      setStatus('init')
      setEditorKey(getV1())
   }

   const clearAll =  () => {
      setItem(null)
      setEditorKey(getV1())
   }

   const childrenWithProps = React.cloneElement(children, {
      key: editorKey,
      submitHandler: submitHandler,
      item, dataType
   })

   useEffect(() => {
      if (status === 'init')
         fetchData()
   }, [status, fetchData])

   if (status === 'init')
      return <Loader/>

   if (status !== 'loaded')
      return <SuccessDataForm
         status={status}
         setAllInitial={setToInitial}
         dataType={dataType}
      />

   return (
      <TempImgContext.Provider value={{
         uploadUrl, uploadTempImg, deleteTempImg, deleteTempFolder, loading: tempImgLoading
      }}>
         <Typography
            variant='h4'
            textAlign='center'
            sx={{mb: 3, mt: 2}}
         >
            {title}
         </Typography>

         <Button
            variant={'outlined'}
            style={{ margin: '20 auto' }}
            onClick={clearAll}
         >
            Очистити все
         </Button>

         {childrenWithProps}

         <PopUpLoading isOpen={itemLoading}/>
      </TempImgContext.Provider>
   )
}

export default DataBase