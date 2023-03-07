import React, {FC} from "react";
import {MuiTelInput} from "mui-tel-input";
import {Button} from "@mui/material";


interface IProps {
   onChange: (val: string) => void
   val: string
   error: boolean | undefined
   onDelete: () => void
   first?: boolean
   addOne: () => void
}

const TelInput: FC<IProps> = (
   {
      val,
      onChange,
      error,
      first,
      onDelete,
      addOne,
   }) => {
   return (
      <div style={{
         display: 'flex',
         flexDirection: 'row',
         alignItems: 'center',
         marginTop: '10px'
      }}>
         <div style={{
            border: error ? '1px solid #d32f2f' : '',
            width: 'fit-content',
            borderRadius: '5px'
         }}>
            <MuiTelInput
               id={'tel-input'}
               value={val}
               onChange={onChange}
               error={error}
            />
         </div>

         { first
            ? <div style={{ marginLeft: '15px' }}>
               <Button
                  variant='contained'
                  color='success'
                  onClick={addOne}
                  style={{ padding: '8px 8px', width: 'fit-content' }}
               >
                  +
               </Button>
            </div>
            : <div style={{ marginLeft: '15px' }}>
               <Button
                  onClick={onDelete}
                  variant='contained'
                  color='error'
                  style={{ padding: '8px 8px', width: 'fit-content' }}
               >
                  -
               </Button>
            </div>
         }
      </div>
   )
}

export default TelInput