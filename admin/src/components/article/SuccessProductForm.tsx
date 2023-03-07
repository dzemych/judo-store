import React, {FC} from "react";
import Box from "@mui/material/Box";
import {Link, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import FormsLayout from "../forms/FormsLayout";


interface IProps {
   itemLink: string
   setAllInitial: () => void
   status: 'created' | 'updated' | 'deleted'
}

const SuccessArticleForm: FC<IProps> = ({ itemLink, setAllInitial, status }) => {
   const navigate = useNavigate()

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
               {status === 'created'
                  ? 'Ваш запис був успішно створений' :
                  status === 'updated' ?
                     'Ваш запис було успішно оновлено' :
                     'Ваш запис було успішно видалено'
               }
            </Typography>

            {status !== 'deleted' &&
               <Link mt={2} fontSize='115%' href={`/admin${itemLink}`}>
                  Переглянути запис
               </Link>
            }

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
                     margin: '0 auto'
                  }}
                  onClick={() => navigate(`/product`)}
               >
                  Назад
               </Button>

               <Button
                  variant="contained"
                  style={{ margin: '0 auto', padding: '15px 25px', fontSize: '1rem' }}
                  onClick={setAllInitial}
               >Додати запис</Button>
            </div>
         </Box>
      </FormsLayout>
   )
}

export default SuccessArticleForm