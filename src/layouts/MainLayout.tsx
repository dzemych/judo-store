import React, { FC } from 'react'
import Header from '../components/Navigation/Header/Header'
import Footer from '@components/./Navigation/Footer/Footer'
import classes from './MainLayout.module.sass'


interface IProps {
   children: React.ReactNode
   footer?: boolean
}

const MainLayout: FC<IProps> = ({ children, footer = true }) => {
   return (
      <div className={classes.container}>
         <Header/>

         {children}

         { footer && <Footer/> }
      </div>
   )
}

export default MainLayout