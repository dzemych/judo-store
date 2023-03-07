import React, {FC, SyntheticEvent} from "react"
import classes from './Product.module.sass'
import useProductState from "../../../hooks/api/useProductState"
import FixedBackLayout from "../../../layouts/FixedBackLayout"
import {FetchStatus} from "../../../types/status"
import NoRecordFound from "@components/Product/NoRecordFound/NoRecordFound"
import RecordLoader from "@components/Product/RecordLoader/RecordLoader"
import RecordHead from "@components/Product/RecordHead";
import PhotosList from "../../PhotosList/PhotosList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCartShopping} from "@fortawesome/free-solid-svg-icons"
import {basketSlice} from "../../../store/reducers/basket.slice"
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux"
import {useRouter} from "next/router"


interface IProps {
   slug: string
}

const Product: FC<IProps> = ({ slug }) => {
   const { addProduct } = basketSlice.actions
   const dispatch = useAppDispatch()
   const { list } = useAppSelector(state => state.basketReducer)

   const router = useRouter()

   const { item, status } = useProductState(slug)

   const addBasket = (e: SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const isIn = list.find(el => el.slug === slug)

      if (isIn)
         router.push('/basket')
      else
         dispatch(addProduct(slug))
   }

   if (!item && status === FetchStatus.INIT)
      return <RecordLoader/>

   if (status === FetchStatus.NO_DATA)
      return <NoRecordFound/>

   if (!item)
      return <NoRecordFound/>

   return (
      <>
         <RecordHead title='Запис' text={item.title}/>

         <FixedBackLayout
            backImgSrc={item?.backPhoto}
            title={item.title}
            beforeTitle={item.price as string}
         >
            <div className={classes.basket} onClick={addBasket}>
               Add to basket &nbsp;<FontAwesomeIcon icon={faCartShopping}/>
            </div>

            <div className={classes.container}>
               {item.content
                  && <div className='ck-content' dangerouslySetInnerHTML={{ __html: item.content }}/>
               }
            </div>

            { (item.photos && item.photos.length) &&
               <PhotosList photos={item.photos} layout='secondary'/>
            }
         </FixedBackLayout>
      </>
   )
}

export default Product