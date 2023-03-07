import React, {FC, useState} from "react";
import BaseLayout from "../../components/forms/BaseLayout";
import classes from "../Home/Home.module.sass";
import {Grid, Typography} from "@mui/material";
import {IChangeInputEvent, ITextInput} from "../../types/textInputTypes";
import TextInputs from "../../components/forms/TextInputs";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useHttp, {METHOD} from "../../hooks/api/useHttp";
import PopUpLoading from "../../components/PopUp/PopUpLoading";
import PopUpError from "../../components/PopUp/PopUpError";
import SuccessUserChange from "./SuccessUserChange";
import {ObjStrKeys} from "../../types/formsStateTypes";


const initState: ObjStrKeys = {
   oldPwd: '', newPwd: '', confirmNewPwd: ''
}

const User: FC = () => {

   const { requestJson, loading, clearError, error } = useHttp()
   const [status, setStatus] = useState<'init' | 'updated'>('init')

   const [email, setEmail] = useState('')
   const [emailError, setEmailError] = useState(false)

   const [pwdState, setPwdState] = useState(initState)
   const [pwdError, setPwdError] = useState(initState)

   const setAllInitial = () => {
      setEmailError(false)
      setStatus('init')
      setEmail('')
      setPwdState(initState)
      setPwdError(initState)
   }

   const handleEmailChange = (e:  IChangeInputEvent) => {
      e.preventDefault()
      setEmail(e.target.value)
   }

   const handlePwdChange = (key: keyof typeof pwdState) => (e:  IChangeInputEvent) => {
      setPwdState(prev => ({ ...prev, [key]: e.target.value }))
   }

   const emailValidation = (): boolean => {
      return (
         !email ||
         !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
      )
   }

   const pwdValidation = (): boolean => {
      const { oldPwd, newPwd, confirmNewPwd } = pwdState
      const newErrors = {...initState}

      if (!oldPwd)
         newErrors.oldPwd = 'Введіть старий пароль'

      if (!newPwd)
         newErrors.newPwd = 'Введіть новий пароль'

      if (!confirmNewPwd)
         newErrors.confirmNewPwd = 'Підтвердіть новий пароль'

      if (!newErrors.newPwd && newPwd.length < 8)
         newErrors.newPwd = 'Пароль має містити мінімум 8 літер'

      if (!newErrors.newPwd && !( newPwd.match(/\d/) ))
         newErrors.newPwd = 'Пароль має містити мінімум одну цифру'

      const isUpperCase = [...newPwd].reduce((acc, ch) => {
         if (Number.isFinite(ch))
            return acc

         if (ch === ch.toLowerCase())
            return acc

         if (ch === ch.toUpperCase())
            acc = true

         return acc
      }, false)

      if (!newErrors.newPwd && !isUpperCase)
         newErrors.newPwd = 'Пароль має містити мінімум одну велику літеру'

      if (!newErrors.confirmNewPwd && newPwd !== confirmNewPwd)
         newErrors.confirmNewPwd = 'Паролі не співпадають'

      setPwdError(newErrors)

      return Object.keys(newErrors).reduce((acc, key) => acc && !newErrors[key], true)
   }

   const submitEmail = async () => {
      if (emailValidation()) {
         setEmailError(true)
      } else {
         setEmailError(false)

         const res = await requestJson(
            '/api/auth/changeEmail',
            METHOD.post,
            JSON.stringify({ email }),
            { headers: { 'Content-Type': 'application/json' } }
         )

         if (res.ok)
            setStatus('updated')
      }
   }

   const submitPwd = async () => {
      const isValid = pwdValidation()

      if (isValid) {
         const res = await requestJson(
            '/api/auth/changePassword',
            METHOD.patch,
            JSON.stringify({
               oldPassword: pwdState.oldPwd,
               newPassword: pwdState.newPwd,
               confirmNewPassword: pwdState.confirmNewPwd
            }),
            { headers: { 'Content-Type': 'application/json' } }
         )

         if (res.ok)
            setStatus('updated')
      }
   }

   const pwdInputs: ITextInput[] = [
      {
         key: 'newPwd',
         label: 'Новий пароль',
         value: pwdState.newPwd,
         helperText: pwdError.newPwd,
         error: !!pwdError.newPwd,
         changeHandler: handlePwdChange('newPwd'),
         type: "password"
      },
      {
         key: 'confirmNewPwd',
         label: 'Підтвердіть пароль',
         value: pwdState.confirmNewPwd,
         helperText: pwdError.confirmNewPwd,
         error: !!pwdError.confirmNewPwd,
         changeHandler: handlePwdChange('confirmNewPwd'),
         type: 'password'
      },
   ]

   if (status === 'updated')
      return <SuccessUserChange setAllInitial={setAllInitial}/>

   return (
      <BaseLayout>
         <Typography
            className={classes.title}
            variant='h3'
            color='textPrimary'
            align='center'
         >
            Дані для входу
         </Typography>

         <Grid container spacing={3}>
            <Grid item xs={12} md={6} textAlign={'center'} style={{ marginTop: '15px' }}>
               <Typography
                  variant='h5'
                  color='textPrimary'
                  align='center'
                  style={{ marginBottom: '10px' }}
               >
                  Змінити імейл
               </Typography>

               <TextField
                  label={'Імейл'}
                  fullWidth
                  variant="filled"
                  helperText={emailError && 'Введіть корректний імейл'}
                  error={emailError}
                  value={email}
                  onChange={ handleEmailChange }
               />

               <Button
                  onClick={submitEmail}
                  variant='contained'
                  style={{ marginTop: 15 }}
               >
                  Змінити
               </Button>
            </Grid>

            <Grid item xs={12} md={6} textAlign={'center'} style={{ marginTop: '15px' }}>
               <Typography
                  variant='h5'
                  color='textPrimary'
                  align='center'
                  style={{ marginBottom: '10px' }}
               >
                  Змінити пароль
               </Typography>

               <TextField
                  label={'Старий пароль'}
                  fullWidth
                  variant="filled"
                  helperText={pwdError.oldPwd && pwdError.oldPwd}
                  error={!!pwdError.oldPwd}
                  value={pwdState.oldPwd}
                  onChange={ handlePwdChange('oldPwd') }
               />

               <hr style={{ border: 'none', height: 0, width: '100%', margin: '15px 0' }}/>

               <div className={classes.pwd_inputs_container}>
                  <TextInputs inputs={pwdInputs}/>
               </div>

               <Button
                  onClick={submitPwd}
                  variant='contained'
                  style={{ marginTop: 5 }}
               >
                  Змінити
               </Button>
            </Grid>
         </Grid>

         <PopUpLoading isOpen={loading}/>
         <PopUpError isOpen={error} onClose={clearError}/>
      </BaseLayout>
   )
}

export default User