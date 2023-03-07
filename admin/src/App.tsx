import React, {FC} from 'react'
import {BrowserRouter} from "react-router-dom"
import Router from "./Router"
import MainLayout from "./layout/MainLayout"
import 'src/assets/styles/global.sass'


const App: FC = () => {
   return (
      <BrowserRouter basename='/admin'>
         <MainLayout>
            <Router/>
         </MainLayout>
      </BrowserRouter>
   )
}

export default App