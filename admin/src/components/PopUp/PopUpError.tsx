import {FC, useEffect} from "react";
import {Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


interface IProps {
   isOpen: boolean | string | null
   onClose: () => void
   text?: string
}

const style = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',
   border: '2px solid #000',
   boxShadow: 24,
   p: 4,
}

const PopUpError: FC<IProps> = ({ isOpen, onClose, text }) => {

   useEffect(() => {
      if (isOpen)
         document.body.style.overflowY = 'hidden'

      if (!isOpen)
         document.body.style.overflowY = 'scroll'

      return () => {
         document.body.style.overflowY = 'scroll'
      }
   }, [isOpen])

   if (!isOpen)
      return null

   return (
      <div style={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         position: 'fixed',
         top: 0,
         bottom: 0,
         right: 0,
         left: 0,
         zIndex: 100
      }}>
         <Modal
            keepMounted
            open={!!isOpen}
            onClose={onClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            style={{ cursor: 'pointer' }}
         >
            <Box sx={style} style={{ cursor: 'auto' }}>
               <Typography
                  id="keep-mounted-modal-title"
                  variant="h6"
                  component="h2"
                  color="#cb4d4d"
               >
                  {text ? text : 'Виникла неочікувана помилка'}
               </Typography>

               {/*<Typography id="keep-mounted-modal-description" sx={{ mt: 2, mb: 2 }}>*/}
               {/*   Будь ласка перезавантажте сторінку на сробуйте ще раз*/}
               {/*</Typography>*/}

               <Button
                  variant='contained'
                  style={{
                     marginTop: '30px',
                     left: '50%',
                     transform: 'translate(-50%, -50%)'
                  }}
                  onClick={onClose}
               >
                  Ок
               </Button>
            </Box>
         </Modal>
      </div>
   )
}

export default PopUpError