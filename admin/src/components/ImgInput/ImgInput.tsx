import React, {FC, useCallback, useRef} from 'react'
import TextField from '@mui/material/TextField'
import classes from './ImgInput.module.sass'
import Grid from '@mui/material/Grid/Grid'
import ImgItem from "./ImgItem"


interface IProps {
   label: string
   error: boolean
   state: File | null | string | Array<string> | undefined
   changeHandler: (val: FileList) => Promise<void> | void
   deleteHandler: (idx: number) => void
   disabled?: boolean
   nextHandler?: (idx: number) => void
   prevHandler?: (idx: number) => void
   firstHandler?: (idx: number) => void
   multiple?: boolean
   photoPreview?: boolean
   helperText?: string
}

const ImgInput: FC<IProps> = (
   {
      error,
      changeHandler,
      state,
      multiple,
      label,
      deleteHandler,
      prevHandler,
      nextHandler,
      firstHandler,
      photoPreview = true,
      disabled = false
      // helperText,
   }) => {

   const getUid = useCallback(() => {
      return `${Date.now()}-${Math.random() * 10000}`
   }, [])

   const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>

   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const files = inputRef.current.files
      inputRef.current.files = new DataTransfer().files

      if (files?.length)
         await changeHandler(files)
   }

   const onInputClick = () => {
      if (!disabled)
         inputRef.current.click()
   }

   const getPhotoList = () => {
      if (!state) return null

      if (state instanceof File || typeof state === 'string' )
         return (
            <ImgItem
               idx={0}
               key={'main-img'}
               img={state}
               type={'single'}
               deleteHandler={deleteHandler}
            />
      )

      return (
         state.map((el, i) => (
            <ImgItem
               key={el === 'loading' ? getUid() : el}
               img={el}
               idx={i}
               type={'multi'}
               deleteHandler={deleteHandler}
               nextHandler={nextHandler}
               prevHandler={prevHandler}
               firstHandler={firstHandler}
            />
         ))
      )
   }


   // const getHelperText = () => {
   //    if (helperText === undefined)
   //       return 'Додати фото'
   //
   //    if (helperText === null)
   //       return false
   //
   //    return helperText
   // }

   return (
      <div className={classes.container}>
         <TextField
            id="img-input"
            error={error}
            label={label}
            defaultValue={multiple ? 'Додати фотографії' : 'Додати фото'}
            InputProps={{
               readOnly: true,
            }}
            onClick={onInputClick}
            className={classes.input_wrapper}
         />
         <input
            type='file'
            accept="image/*"
            multiple={multiple}
            ref={inputRef}
            onChange={handleChange}
            style={{ display: 'none' }}
            disabled={disabled}
         />

         {photoPreview && <Grid
            container
            spacing={2}
            className={classes.img_preview}
         >
            {getPhotoList()}
         </Grid>}

      </div>
   )
}

export default ImgInput