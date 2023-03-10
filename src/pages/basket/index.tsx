import React, {FC, useEffect, useState} from "react"
import classes from './basket.module.sass'
import List from "@components/Lists/List/List"
import FixedBackLayout from "../../layouts/FixedBackLayout"
import Head from "next/head"
import {ArticleCardContent, ArticleCardTheme, IArticleCard} from "../../types/content/article"
import {useAppSelector} from "../../hooks/useRedux"
import useHttp from "../../hooks/api/useHttp"
import useTextFormsState from "../../hooks/useTextFormsState"
import {IOrderState} from "../../types/form.types"
import {getInputs} from "../../assets/orderFormInputs"
import TextInput from "../../components/UI/TextInput/TextInput"
import Button from "../../components/UI/Button/Button"
import {useRouter} from "next/router"


const initialFormsState: IOrderState = {
   name: '',
   surname: '',
   tel: '',
   email: '',
   country: '',
   city: '',
   street: '',
   floor: '',
   flat: '',
   postalCode: ''
}

const Basket: FC = () => {
   const { list } = useAppSelector(state => state.basketReducer)

   const router = useRouter()
   const { requestJson } = useHttp()

   const [elements, setElements] = useState<IArticleCard[]>([])
   const [totalPrice, setTotalPrice] = useState(0)

   const { state, changeState, errors } = useTextFormsState(initialFormsState)

   const onSubmit = () => {
      console.log(state)
      console.log(totalPrice)
   }

   const inputs = getInputs(state, changeState, errors, onSubmit)

   useEffect(() => {
      const slugArr = list.map(el => el.slug)
      const strSlugs = slugArr.join(',')

      const fetchElements = async () => {
         const res = await requestJson('/api/product?select=-content-photos&slug[in]=' + strSlugs)

         if (res?.items?.length)
            setElements(res.items)
      }

      if (list && list.length)
         fetchElements()
      else
         setElements([])
   }, [list])

   useEffect(() => {
      if (list.length && elements.length) {
         const newTotal = list.reduce((acc, el) => {
            const product = elements.find(product => product.slug === el.slug)

            if (product)
               acc = acc + (el.amount * product.price)

            return acc
         }, 0)

         setTotalPrice(newTotal)
      }
   }, [list, elements])

   return (
      <>
         <Head>
            <meta name='description' content='Basket of judo store'/>
            <title>Judo Store | Basket</title>
         </Head>

         <FixedBackLayout pageName='basket'>
            { list.length
               ? <>
                  <List
                     basket={true}
                     length={20}
                     arr={elements}
                     colorSchema={ArticleCardTheme.BLACK_TRANSPARENT}
                     contentPosition={ArticleCardContent.NORMAL}
                     layout={'secondary'}
                  />

                  <div className={classes.totalPrice}>
                     Total to pay: {totalPrice} $
                  </div>

                  <div className={classes.basket_container}>
                     <p className={classes.order_info_text}>
                        We will deliver your package by courier. Track number and further
                        information will be sent to you by email.
                     </p>

                     <div className={classes.list}>
                        { inputs.map(el => (
                           <TextInput
                              key={el.title}
                              value={el.value}
                              onChange={el.onChange}
                              onSubmit={el.onSubmit}
                              title={el.title}
                              error={el.error}
                              placeholder={el.placeholder}
                           />
                        )) }
                     </div>

                     <div className={classes.submit_container}>
                        <Button onClick={onSubmit} color={'black'}>
                           Order and pay
                        </Button>
                     </div>
                  </div>
               </>
               : <h1 className={classes.noEl_title}>No elements added yet</h1>
            }
         </FixedBackLayout>
      </>
   )
}

export default Basket