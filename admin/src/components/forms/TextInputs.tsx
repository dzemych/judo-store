import React, {FC, useState} from "react";
import {
   FilledInput,
   FormControl,
   Grid,
   IconButton,
   InputAdornment,
   InputLabel,
   FormHelperText
} from "@mui/material";
import TextField from "@mui/material/TextField";
import {ITextInput} from "../../types/textInputTypes";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const TextInputs: FC<{ inputs: ITextInput[] }> = ({ inputs }) => {
   const [showPwd, setShowPwd] = useState(false)

   const toggleShowPwd = () => {
      setShowPwd(prev => !prev)
   }

   const renderPwdInput = (el: ITextInput) => (
      <FormControl sx={{ width: '100%'}}>
         <InputLabel htmlFor={el.key}>{el.label}</InputLabel>
         <FilledInput
            aria-autocomplete={'none'}
            autoComplete='none'
            id={el.key}
            type={showPwd ? 'text' : 'password'}
            value={el.value}
            onChange={el.changeHandler}
            error={el.error}
            endAdornment={
               <InputAdornment position="end">
                  <IconButton
                     aria-label="toggle password visibility"
                     onClick={toggleShowPwd}
                     edge="end"
                  >
                     {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
               </InputAdornment>
            }
         />
         <FormHelperText style={{ color: '#C94E4E' }}>
            { el.helperText }
         </FormHelperText>
      </FormControl>
   )

   return <>
      {inputs.map(el => (
         <Grid key={el.key} item xs={12} sx={{ mb: 1.5 }} >
            { el.type === 'password'
               ? renderPwdInput(el)
               : <TextField
                  label={el.label}
                  fullWidth
                  variant="filled"
                  helperText={el.helperText}
                  error={el.error}
                  value={el.value}
                  onChange={ el.changeHandler }
                  multiline={ !!(el.rows && el.rows > 1) || el.multiline }
                  minRows={ el.rows ? el.rows : 1 }
               />
            }
         </Grid>
      ))}
   </>
}

export default TextInputs