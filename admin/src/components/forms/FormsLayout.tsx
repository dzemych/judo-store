import {FC} from "react";
import Box from "@mui/material/Box";

const FormsLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
   return (
      <Box style={{
         display: 'flex',
         flexWrap: 'wrap',
         width: '100%',
         position: 'relative',
         marginTop: '30px'
      }}>
         {children}
      </Box>
   )
}

export default FormsLayout