import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {IMediaState} from "../../types/store/media.types"


const xs = 0
const sm = 600
const md = 900
const lg = 1200
const xl = 1536

const initialMedia: IMediaState = {
   extSmall: false,
   small: false,
   medium: false,
   large: false,
   extLarge: false,
   vw: 0
}

export const mediaSlice = createSlice({
   name: 'media',
   initialState: initialMedia,
   reducers: {
      widthChange(state, action: PayloadAction<number>) {
         const vw = action.payload
         state.vw = vw

         if (vw >= xs)
            state.extSmall = true

         if (vw >= sm)
            state.small = true

         if (vw >= md)
            state.medium = true

         if (vw >= lg)
            state.large = true

         if (vw >= xl)
            state.extLarge = true
      }
   }
})

export default mediaSlice.reducer