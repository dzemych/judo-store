import {FC, useEffect} from "react";
import {Container, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


interface IProps {
   text: string
   isOpen: boolean
   onConfirm: ((...params: any[]) => void) | undefined
   onClose: () => void
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

const PopUpConfirm: FC<IProps> = ({ text, isOpen, onConfirm, onClose }) => {

   useEffect(() => {
      if (isOpen)
         document.body.style.overflowY = 'hidden'

      if (!isOpen)
         document.body.style.overflowY = 'scroll'

      return () => {
         document.body.style.overflowY = 'scroll'
      }
   }, [isOpen])

   if (!isOpen) return null

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
            open={isOpen}
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
                  textAlign='center'
               >
                  {text}
               </Typography>

               <Container sx={{
                  display: 'flex',
                  width: '60%',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  mt: 2
               }}>
                  <Button
                     variant='contained'
                     color='error'
                     onClick={onConfirm}
                  >
                     Так
                  </Button>

                  <Button
                     variant='contained'
                     color='primary'
                     onClick={onClose}
                  >
                     Ні
                  </Button>
               </Container>
            </Box>
         </Modal>
      </div>
   )
}

export default PopUpConfirm