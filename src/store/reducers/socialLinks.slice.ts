import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ISocialLinksState} from "../../types/store/socialLilnks.types"
import {fetchSocialLinks} from "./actionCreators"


const initialState: ISocialLinksState = {
   telegram: '', viber: '', instagram: '', facebook: ''
}

export const socialLinksSlice = createSlice({
   name: 'socialLinks',
   initialState,
   reducers: {
   },
   extraReducers: {
      [fetchSocialLinks.fulfilled.type]: (state, action) => {
         Object.keys(state).forEach(key => {
            state[key] = action.payload[key]
         })
      },
      // [fetchSocialLinks.pending.type]: () => {
      // }
   }
})

export default socialLinksSlice.reducer