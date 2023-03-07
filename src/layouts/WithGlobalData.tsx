import {FC, ReactNode, useEffect} from "react"
import {fetchSocialLinks} from "../store/reducers/actionCreators"
import {useAppDispatch} from "../hooks/useRedux"
import {mediaSlice} from "../store/reducers/media.slice"
import {basketSlice} from "../store/reducers/basket.slice"


interface IProps {
   children: ReactNode
}

const WithGlobalData: FC<IProps> = ({ children }) => {
   const dispatch = useAppDispatch()
   const { getBasketListFromLocal } = basketSlice.actions

   const handleResize = () => {
      dispatch(mediaSlice.actions.widthChange(window.innerWidth))
   }

   // Fetch global data
   useEffect(() => {
      dispatch(fetchSocialLinks())
      dispatch(getBasketListFromLocal())
   }, [])

   // Change media breakpoints on window width
   useEffect(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   return <> {children} </>
}

export default WithGlobalData