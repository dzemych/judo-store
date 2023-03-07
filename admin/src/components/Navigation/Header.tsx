import React, {FC} from "react";
import {IconButton, styled, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar'
import useMedia from "../../hooks/useMedia";


interface IProps {
   open: boolean
   drawerWidth: number
   toggleDrawer: () => void
}

interface AppBarProps extends MuiAppBarProps {
   open?: boolean
   drawerwidth: number
   islaptop: number
}

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open',})<AppBarProps>
(({theme, open, drawerwidth, islaptop}) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   ...((open && islaptop) && {
      marginLeft: drawerwidth,
      width: `calc(100% - ${drawerwidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}))

const Header: FC<IProps> = ({ open, drawerWidth, toggleDrawer }) => {

   // TODO header freezes on iphone
   const { isLaptop } = useMedia()

   return (
      <AppBar
         position="absolute"
         open={open}
         drawerwidth={drawerWidth}
         islaptop={isLaptop ? 1 : 0}
      >
         <Toolbar sx={{pr: '24px'}}>
            <IconButton
               edge="start"
               color="inherit"
               aria-label="open drawer"
               onClick={() => toggleDrawer()}
               sx={{
                  marginRight: '36px',
                  ...((open && isLaptop) && {display: 'none'}),
               }}
            >
               <MenuIcon/>
            </IconButton>

            <Typography
               component="h1"
               variant="h6"
               color="inherit"
               noWrap
               sx={{flexGrow: 1}}
            >
               Адмін панель
            </Typography>
         </Toolbar>
      </AppBar>
   )
}

export default Header