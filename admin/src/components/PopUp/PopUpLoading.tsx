import {FC, useEffect} from "react";
import {CircularProgress, useTheme} from "@mui/material";


interface IProps {
   isOpen: boolean
}

const PopUpLoading: FC<IProps> = ({ isOpen }) => {

   const theme = useTheme()

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
         <div style={{
            width: '100%',
            height: '100%',
            position: "absolute",
            background: theme.palette.grey['200'],
            opacity: .5,
         }}/>
         <CircularProgress sx={{ opacity: 1, zIndex: 200 }} />
      </div>
   )
}

export default PopUpLoading