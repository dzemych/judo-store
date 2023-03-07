import {combineReducers, configureStore} from "@reduxjs/toolkit"
import basketReducer from './reducers/basket.slice'
import socialLinksReducer from './reducers/socialLinks.slice'
import mediaReducer from './reducers/media.slice'
import {createWrapper} from "next-redux-wrapper"


const rootReducer = combineReducers({
   basketReducer,
   socialLinksReducer,
   mediaReducer,
})

export const setupStore = () => {
   return configureStore({
      reducer: rootReducer
   })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(setupStore);