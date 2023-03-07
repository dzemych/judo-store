import React, { FC, JSXElementConstructor, ReactElement, useCallback, useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import PopUpLoading from '../PopUp/PopUpLoading'
import PopUpError from '../PopUp/PopUpError'
import useItemApi from '../../hooks/api/useItemApi'
import SuccessArticleForm from './SuccessProductForm'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../UI/Loader'
import useUid from '../../hooks/useUid'
import TempImgContext from '../../context/tempImgContext'
import useTempImg from '../../hooks/api/useTempImg'
import RecordContext from '../../context/recordContext'
import Button from '@mui/material/Button'


interface IProps {
   title: string
   children: ReactElement<any, string | JSXElementConstructor<any>>
   type: 'create' | 'update',
}

const ProductBase: FC<IProps> = (
   {
      title,
      children,
      type,
   }) => {

   const params = useParams()
   const navigate = useNavigate()

   const {
      createItem,
      updateItem,
      deleteItem,
      getOneItem,
      error,
      clearError,
      loading: itemLoading
   } = useItemApi()
   const {
      uploadTempImg,
      deleteTempImg,
      uploadUrl,
      deleteTempFolder,
      loading: tempImgLoading
   } = useTempImg('product', type)

   const { getV1 } = useUid()
   const [status, setStatus] = useState<'init' | 'loaded' |'created' | 'updated' | 'deleted'>('init')
   const [itemLink, setItemLink] = useState('')
   const [item, setItem] = useState<any>(null)
   const [editorKey, setEditorKey] = useState(getV1())

   const clearLocalAndTempStorage = () => {
      deleteTempFolder()
      window.localStorage.removeItem('product')

      window.localStorage.removeItem('product_photos')
   }

   const clearAll =  () => {
      if (type === 'create')
         clearLocalAndTempStorage()

      setStatus("init")
      setEditorKey(getV1())
   }

   const createHandler = async (formData: FormData) => {
      const slug = await createItem(formData)

      if (slug) {
         clearLocalAndTempStorage()

         setStatus('created')
         setItemLink(`/product/${slug}`)
      }
   }

   const deleteHandler = async () => {
      const isDeleted = await deleteItem(item._id)

      if (isDeleted)
         setStatus('deleted')
   }

   const updateHandler = async (formData: FormData) => {
      const newSlug = await updateItem(params.slug, formData)

      if (newSlug) {
         setStatus('updated')
         setItemLink(`/product/${newSlug}`)
      }
   }

   const setToInitial = () => {
      setStatus('init')
      setEditorKey(getV1())
      navigate(`/product/new`)
   }

   const fetchItem = useCallback(async () => {
      const res = await getOneItem(params.slug)

      setItem(res)
      setStatus('loaded')
   }, [getOneItem, params.slug])

   useEffect(() => {
      if (type === 'update')
         fetchItem()

      setEditorKey(getV1())
   }, [params.slug, type, fetchItem, getV1])

   if (type === 'update' && !item && !error)
      return <Loader/>

   if (type === 'update' && error?.match(/no item found/i))
      return <Typography
         variant='h3'
         sx={{
            margin: theme => theme.spacing(3, '0'), textAlign: 'center',
            color: theme => theme.palette.grey['500']
         }}
      >
         Запис не найдено
      </Typography>

   if (status !== 'init' && status !== 'loaded')
      return <SuccessArticleForm
         status={status}
         itemLink={itemLink}
         setAllInitial={setToInitial}
      />

   const childrenWithProps = React.cloneElement(children, {
      key: editorKey,
      submitHandler: type === 'create' ? createHandler : updateHandler,
      deleteHandler: type === 'create' ? undefined : deleteHandler,
      item: (type === 'create' || status === 'init') ? undefined : item,
   })

   return <RecordContext.Provider value={{ recordType: type }}>
      <TempImgContext.Provider value={{
         uploadUrl, uploadTempImg, deleteTempImg, deleteTempFolder, loading: tempImgLoading
      }}>
         <Typography
            variant='h4'
            textAlign='center'
            sx={{ mb: 3, mt: 2 }}
         >
            { title }
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
         <PopUpError isOpen={error} onClose={clearError}/>
      </TempImgContext.Provider>
   </RecordContext.Provider>
}

export default ProductBase