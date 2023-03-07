import React, {FC} from "react";
import {
   styled,
   Drawer as UsualDrawer
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer'
import {DrawerProps as MuiDrawerProps} from "@mui/material/Drawer/Drawer"
import useMedia from "../../hooks/useMedia";


interface IProps {
   open: boolean
   drawerWidth: number
   children: React.ReactNode
   toggleDrawer: (state?: boolean) => void
}

interface DrawerProps extends MuiDrawerProps {
   open?: boolean
   drawerwidth: number
}

const CustomDrawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})<DrawerProps>(
   ({theme, open, drawerwidth}) => ({
      '& .MuiDrawer-paper': {
         position: 'relative',
         whiteSpace: 'nowrap',
         width: drawerwidth,
         transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
         }),
         boxSizing: 'border-box',
         ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
               easing: theme.transitions.easing.sharp,
               duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
               width: theme.spacing(9),
            },
         }),
      },
   }),
)

const Drawer: FC<IProps> = ({ open, drawerWidth, children, toggleDrawer }) => {

   const { isLaptop } = useMedia()

   if (isLaptop) return (
      <CustomDrawer
         variant="permanent"
         open={open}
         drawerwidth={drawerWidth}
      >
         {children}
      </CustomDrawer>
   )

   return (
      <UsualDrawer
         anchor='left'
         open={open}
         onClose={() => toggleDrawer()}
         sx={{ '& .MuiDrawer-paper': {
            width: '240px',
            maxWidth: '90vw'
         }}}
      >
         {children}
      </UsualDrawer>
   )
}

export default Drawer