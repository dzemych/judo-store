import {FC} from "react";
import {Container, Typography} from "@mui/material";


interface IProps {
   title: string
   children: React.ReactNode
}

const ListLayout: FC<IProps> = ({ title, children }) => {
   return (
      <Container
         maxWidth="md"
         style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
         }}
      >
         <Typography
            variant='h3'
            color='textPrimary'
            align='center'
            gutterBottom
            sx={{ mt: 3, mb: 2 }}
         >
            {title}
         </Typography>

         {children}
      </Container>
   )
}

export default ListLayout