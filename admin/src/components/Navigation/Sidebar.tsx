import React, {FC} from "react";
import {
   Divider,
   IconButton,
   List,
   Toolbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItems from "./ListItems"
import Drawer from "./Drawer";


interface IProps {
   open: boolean
   toggleDrawer: (state?: boolean) => void
   drawerWidth: number
}

const Sidebar: FC<IProps> = ({ open, toggleDrawer, drawerWidth }) => {

   return (
      <Drawer
         open={open}
         drawerWidth={drawerWidth}
         toggleDrawer={toggleDrawer}
      >
         <>
            <Toolbar
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: [1],
               }}
            >
               <IconButton onClick={() => toggleDrawer()}>
                  <ChevronLeftIcon/>
               </IconButton>
            </Toolbar>

            <Divider/>

            <List component="nav">
               <ListItems toggleDrawer={toggleDrawer}/>

               <Divider sx={{my: 1}}/>
            </List>
         </>
      </Drawer>
   )
}

export default Sidebar