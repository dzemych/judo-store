import React, {FC} from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import FormsLayout from "../forms/FormsLayout";
import {DataTypes} from "../../types/dataTypes";


interface IProps {
   dataType: DataTypes
   setAllInitial: () => void
   status: 'created' | 'updated'
}

const SuccessDataForm: FC<IProps> = ({ dataType, setAllInitial }) => {
   const getTitle = () => {
      switch (dataType) {
         case DataTypes.HALL: return 'Запис залу було оновлено'
         case DataTypes.ABOUT: return "Запис про нас було оновлено"
         case DataTypes.CONTACTS: return 'Контакти було оновлено'
         case DataTypes.PAGES_DATA: return 'Фотографії було успішно змінені'
         default: return 'Запис було успішно оновлено'
      }
   }

   return (
      <FormsLayout>
         <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            sx={{ margin: '0 auto' }}
         >
            <Typography variant={'h5'} textAlign='center'>
               {getTitle()}
            </Typography>

            <div
               style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: '25px'
               }}
            >
               <Button
                  variant="text"
                  style={{
                     margin: dataType !== DataTypes.PAGES_DATA ? '0 15px 0 auto' : '0 auto',
                  }}
                  onClick={setAllInitial}
               >
                  Редагувати знову
               </Button>

               { dataType !== DataTypes.PAGES_DATA &&
                  <Button
                     variant="contained"
                     style={{
                        margin: '0 auto',
                        padding: '15px 25px',
                        fontSize: '1rem'
                     }}
                     onClick={setAllInitial}
                  >
                     Переглянути запис
                  </Button>
               }
            </div>
         </Box>
      </FormsLayout>
   )
}

export default SuccessDataForm