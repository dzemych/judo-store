import {createContext} from "react"


type ISetSidebar<T> = (state: T) => T

interface IAppContext {
   newPage: boolean
   toggleNewPage: () => void
   setSidebar: (state: boolean | ISetSidebar<boolean>) => void
   isSidebar: boolean
   curPage: string
}

export const AppContext = createContext<IAppContext>({
   newPage: false,
   toggleNewPage: () => {},
   setSidebar: () => {},
   isSidebar: false,
   curPage: ''
})