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
import {getInputs} from "./orderFormInputs"


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

   const { requestJson } = useHttp()

   const [elements, setElements] = useState<IArticleCard[]>([])
   const { state, changeState, errors, checkValid } = useTextFormsState(initialFormsState)

   const onSubmit = () => {
      console.log(checkValid())
      console.log(state)
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

   return (
      <>
         <Head>
            <meta name='description' content='Basket of judo store'/>
            <title>Judo Store | Basket</title>
         </Head>

         <FixedBackLayout pageName='basket'>
            <List
               basket={true}
               length={20}
               arr={elements}
               colorSchema={ArticleCardTheme.BLACK_TRANSPARENT}
               contentPosition={ArticleCardContent.NORMAL}
               layout={'secondary'}
            />

            <div className={classes.basket_container}>

            </div>
         </FixedBackLayout>
      </>
   )
}

export default Basket