import {createContext} from "react";
import {ITempImgContextState} from "../types/tempImgTypes";


const TempImgContext = createContext<ITempImgContextState>({
   uploadTempImg: (file) => null,
   deleteTempImg: (url) => null,
   deleteTempFolder: () => null,
   loading: false,
   uploadUrl: ''
})

export default TempImgContext