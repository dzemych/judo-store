import { styled } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'


interface IBigButton extends ButtonProps {
   btntype?: 'confirm' | 'cancel'
}

const BigButton = styled(Button)<IBigButton>( ({ theme, btntype }) => ({
   fontSize: btntype === 'confirm' ? '1.5rem' : '1rem',
   padding: btntype === 'confirm' ?
      theme.spacing(2, 6)
      : theme.spacing(1.25, 4),
   [theme.breakpoints.up('sm')]: {
      fontSize: btntype === 'confirm' ? '1.8rem' : '1.25rem',
      padding: btntype === 'confirm' ?
         theme.spacing(3, 9)
         : theme.spacing(1.875, 6, 1.875, 6),
   },
   [theme.breakpoints.up('md')]: {
      fontSize: btntype === 'confirm' ? '2rem' : '1.4rem',
      margin: 0
   },
   borderRadius: '5px',
}) )

export default BigButton