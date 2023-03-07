import React, {FC, SyntheticEvent, useMemo} from "react"
import classes from './MainCard.module.sass'
import Button from "@components/UI/Button/Button"
import useFormatDate from "../../hooks/useFormatDate"
import OpacityYDiv from "@components/UI/OpacityYDiv"
import AnimatedImg from "@components/UI/AnimatedImg"
import {ArticleCardContent, ArticleCardTheme, IArticleCard} from "../../types/content/article"
import {useRouter} from "next/router"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCartShopping, faPlus, faMinus, faTrash} from "@fortawesome/free-solid-svg-icons"
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux"
import {basketSlice} from "../../store/reducers/basket.slice"


interface IProps {
   card: IArticleCard
   showBtn?: boolean
   colorSchema?: ArticleCardTheme
   contentPosition?: ArticleCardContent
   basket?: boolean
}

const MainCard: FC<IProps> =
   ({
       card,
       showBtn = true,
       colorSchema= ArticleCardTheme.WHITE_TRANSPARENT,
       contentPosition = ArticleCardContent.UP,
       basket = false
   }) => {
   const { list } = useAppSelector(state => state.basketReducer)
   const dispatch = useAppDispatch()
   const { addProduct, deleteProduct, increaseAmount, decreaseAmount } = basketSlice.actions

   const { medium } = useAppSelector(state => state.mediaReducer)
   const router = useRouter()

   const productAmount = useMemo(() => {
      const el = list.find(el => el.slug === card.slug)

      if (el)
         return el.amount
      else
         return 1
   }, [list])

   const formatDate = useFormatDate(card.date)

   const addBasket = (e: SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const isIn = list.find(el => el.slug === card.slug)

      if (isIn)
         router.push('/basket')
      else
         dispatch(addProduct(card.slug))
   }

   const deleteBasket = (e: SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch(deleteProduct(card.slug))
   }

   const plusClick = () => {
      dispatch(increaseAmount(card.slug))
   }

   const minusClick = () => {
      dispatch(decreaseAmount(card.slug))
   }

   const cls = [
      classes.container,
      classes[colorSchema],
      classes[contentPosition]
   ]

   const mainColor = colorSchema === ArticleCardTheme.BLACK_TRANSPARENT
      ? 'black' : colorSchema === ArticleCardTheme.WHITE_FILLED
         ? 'black' : 'white'

   const curtainColor = colorSchema === ArticleCardTheme.BLACK_TRANSPARENT
      ? 'white' : 'black'

   const goToItem = () => router.push(`product/${card.slug}`)

   return (
      <div className={cls.join(' ')}>
         <div className={classes.wrapper}>
            <div className={classes.image_container} onClick={goToItem}>
               <AnimatedImg
                  colorSchema={curtainColor}
                  photoSrc={medium ? card.backPhoto : card.mainPhoto}
                  whileInViewport
               />
            </div>

            { !basket
               ? <div className={classes.basket} onClick={addBasket}>
                  <FontAwesomeIcon icon={faCartShopping}/>
               </div>
               : <div className={classes.basket} onClick={deleteBasket}>
                  <FontAwesomeIcon icon={faTrash}/>
               </div>
            }

            <OpacityYDiv className={classes.content} delay={.2} whileInViewport>
               {(card.price && !basket) && (
                  <div className={classes.before_title}>
                     {card.price} $
                  </div>
               )}

               <h1 className={classes.title}>
                  {card.title}
               </h1>

               {card.afterTitle && (
                  <div className={classes.after_title}>
                     {card.afterTitle}
                  </div>
               )}

               { formatDate &&
                  <div className={classes.date}>
                     {formatDate}
                  </div>
               }

               {card.text && (
                  <div className={classes.text}>
                     {card.text}
                  </div>
               )}

               {(showBtn && !basket) && (
                  <div className={classes.btn_container} onClick={goToItem}>
                     <Button color={mainColor}>
                        details
                     </Button>
                  </div>
               )}

               { (basket && card.price) &&
                  <div className={classes.basket_container}>
                     <div className={classes.basket_row}>
                        <div>Price</div>
                        <div>{card.price}</div>
                     </div>

                     <div className={classes.basket_row}>
                        <div>Amount</div>
                        <div>{productAmount}</div>
                     </div>

                     <div className={classes.basket_row}>
                        <div>Total price</div>
                        <div>{productAmount * card.price} $</div>
                     </div>

                     <div className={classes.count_container}>
                        <FontAwesomeIcon icon={faMinus} onClick={minusClick}/>
                        <FontAwesomeIcon icon={faPlus} onClick={plusClick}/>
                     </div>
                  </div>
               }
            </OpacityYDiv>
         </div>
      </div>
   )
}

export default MainCard