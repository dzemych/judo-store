import React, {FC} from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Button from "@mui/material/Button";
import FormsLayout from "../../components/forms/FormsLayout";


interface IProps {
   setAllInitial: () => void
}

const SuccessUserChange: FC<IProps> = ({ setAllInitial }) => {
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
               Данні успішно змінені
            </Typography>

            <div
               style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  marginTop: '25px'
               }}
            >
               <Button variant='outlined' onClick={setAllInitial}>
                  Редагувати знову
               </Button>
            </div>
         </Box>
      </FormsLayout>
   )
}

export default SuccessUserChange