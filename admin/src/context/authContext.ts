import {createContext} from "react";
import {IAuthContext} from "../types/authTypes";

const AuthContext = createContext<IAuthContext>({
   isAuth: false,
   token: '',
   email: '',
   login: () => {},
   logout: () => {}
})

