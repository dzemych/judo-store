import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ArticleIcon from '@mui/icons-material/Article'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import CallIcon from '@mui/icons-material/Call'
import {Link} from "react-router-dom"
import {FC} from "react"


interface IProps {
   toggleDrawer: (state?: boolean) => void
}

interface ILink {
   to: string
   icon: React.ReactNode
   text: string
}

const ListItems: FC<IProps> = ({ toggleDrawer }) => {
   const list: ILink[] = [
      { to: '/', icon: <DashboardIcon/>, text: 'Головна'},
      { to: '/product', icon: <ArticleIcon/>, text: 'Блог'},
      { to: '/about', icon: <DescriptionIcon/>, text: 'Про нас'},
      { to: '/contacts', icon: <CallIcon/>, text: 'Контакти'},
      { to: '/user', icon: <AccountCircleIcon/>, text: 'Користувач'},
   ]

   const renderLink = (link: ILink, idx: number) => (
      <Link
         to={link.to}
         key={link.to + idx}
         onClick={() => toggleDrawer(false)}
         style={{
            outline: "none",
            textDecoration: 'none',
            color: 'initial',
         }}
      >
         <ListItemButton sx={{ pb: idx === 0 ? 3 : '' }}>
            <ListItemIcon>
               {link.icon}
            </ListItemIcon>

            <ListItemText primary={link.text}/>
         </ListItemButton>
      </Link>
   )

   return (
      <>
         {list.map((link, i) => renderLink(link, i))}
      </>
   )
}

export default ListItems