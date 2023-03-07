import { Grid } from '@mui/material'
import { FC, ReactNode } from 'react'


interface IProps {
   children: ReactNode
   id?: string
}

const GridInputContainer: FC<IProps> = ({ children, id }) => {
   return (
      <Grid item xs={12} sx={{ mb: 2 }} id={id ? id : ''}>
         {children}
      </Grid>
   )
}

export default GridInputContainer