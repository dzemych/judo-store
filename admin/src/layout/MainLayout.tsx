import React, {FC, useState} from "react"
import {
   Box,
   createTheme,
   CssBaseline,
   ThemeProvider,
   Toolbar,
} from "@mui/material"
import Footer from "../components/Navigation/Footer";
import Header from "../components/Navigation/Header";
import Sidebar from "../components/Navigation/Sidebar";


interface IProps {
   children: React.ReactNode
}

const drawerWidth: number = 240

const mdTheme = createTheme({
   breakpoints: {
      values: {
         xs: 0,
         sm: 600,
         md: 950,
         lg: 1150,
         xl: 1536,
      },
   },
})

const MainLayout: FC<IProps> = ({ children }) => {
   const [open, setOpen] = useState(false)
   const toggleDrawer = (state?: boolean) => {
      setOpen(prev => (state !== undefined)? state : !prev)
   }

   return (
      <ThemeProvider theme={mdTheme}>
         <Box sx={{ display: 'flex' }}>
            <CssBaseline/>

            <Header
               drawerWidth={drawerWidth}
               open={open}
               toggleDrawer={toggleDrawer}
            />

            <Sidebar
               open={open}
               toggleDrawer={toggleDrawer}
               drawerWidth={drawerWidth}
            />

            <Box
               display='flex'
               flexDirection='column'
               sx={{
                  backgroundColor: (theme) =>
                     theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
               }}
               id='main-root'
            >
               <Toolbar/>

               <main style={{
                  display: 'flex',
                  justifySelf: 'flex-start'
               }}>
                  {children}
               </main>

               <Footer sx={{pt: 4}}/>
            </Box>
         </Box>
      </ThemeProvider>
   )
}

export default MainLayout