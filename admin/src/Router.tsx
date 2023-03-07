import {FC} from "react"
import { Routes, Route } from "react-router-dom"
import Home from './containers/Home/Home'
import About from "./containers/About"
import Contacts from "./containers/Contacts";
import User from "./containers/User/User";
import Product from "./containers/Product/Product";
import AddProduct from "./containers/Product/AddProduct"
import EditProduct from "./containers/Product/EditProduct"


const Router: FC = () => {
   return (
      <Routes>
         <Route element={<Home/>} path='/' />

         <Route element={<Product/>} path='/product'/>
         <Route element={<AddProduct/>} path='/product/new'/>
         <Route element={<EditProduct/>} path='product/:slug'/>

         <Route element={<About/>} path='/about' />

         <Route element={<Contacts/>} path='/contacts' />

         <Route element={<User/>} path='/user' />
      </Routes>
   )
}

export default Router