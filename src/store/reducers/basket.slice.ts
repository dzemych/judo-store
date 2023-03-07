import {createSlice} from "@reduxjs/toolkit"
import {BasketState, numPayload, strPayload} from "../../types/store/basket.types"


const initialState: BasketState = {
   list: []
}

const setBasketListToLocal = (state: any) => {
   const jsonData = JSON.stringify(state)

   window.localStorage.setItem('basket', jsonData)
}

export const basketSlice = createSlice({
   name: 'basket',
   initialState,
   reducers: {
      getBasketListFromLocal(state) {
         const jsonData = window.localStorage.getItem('basket')

         if (jsonData)
            state.list = JSON.parse(jsonData).list
      },
      addProduct(state, action: strPayload) {
         const isIn = state.list.find(el => el.slug === action.payload)

         if (!isIn)
            state.list.push({ slug: action.payload, amount: 1 })

         setBasketListToLocal(state)
      },
      deleteProduct(state, action: strPayload) {
         const isIn = state.list.find(el => el.slug === action.payload)

         if (isIn)
            state.list = state.list.filter(el => el.slug !== action.payload)

         setBasketListToLocal(state)
      },
      increaseAmount(state, action: strPayload) {
         const el = state.list.find(el => el.slug === action.payload)

         if (el)
            el.amount++

         setBasketListToLocal(state)
      },
      decreaseAmount(state, action: strPayload) {
         const el = state.list.find(el => el.slug === action.payload)

         if (el && el.amount > 1)
            el.amount--

         setBasketListToLocal(state)
      }
   }
})

export default basketSlice.reducer