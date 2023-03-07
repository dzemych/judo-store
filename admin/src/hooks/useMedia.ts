import {useMediaQuery, useTheme} from "@mui/material";


type IMedia = () => { isLaptop: boolean, isTablet: boolean }

const useMedia: IMedia = () => {
   const theme = useTheme()

   const isLaptop = useMediaQuery(theme.breakpoints.up('md'))
   const isTablet = useMediaQuery(theme.breakpoints.up('sm'))

   return { isLaptop, isTablet }
}

export default useMedia