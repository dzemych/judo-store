import {FC, useEffect} from "react"
import classes from './List.module.sass'
import useNavigation from "../../../hooks/api/useNavigation"
import MainCard from "@components/Card/MainCard"
import OpacityDiv from "@components/UI/OpacityDiv"
import {FetchStatus} from "../../../types/status"
import MainCardSkeleton from "@components/Card/MainCardSkeleton"
import OpacityYDiv from "@components/UI/OpacityYDiv"
import {ArticleCardContent, ArticleCardTheme, IArticleCard} from "../../../types/content/article"
import {useAppSelector} from "../../../hooks/useRedux"


interface IProps {
   title?: string
   length?: number
   colorSchema?: ArticleCardTheme
   contentPosition?: ArticleCardContent
   layout?: 'secondary' | 'primary'
   arr?: IArticleCard[]
   basket?: boolean
}

const List: FC<IProps> =
   ({
       title,
       length = 5,
       arr,
       colorSchema = ArticleCardTheme.WHITE_TRANSPARENT,
       contentPosition = ArticleCardContent.UP,
       layout = 'primary',
       basket = false
   }) => {

      const { large, extLarge } = useAppSelector(state => state.mediaReducer)

      const {
         page,
         pagesCount,
         nextPageHandler,
         prevPageHandler,
         elements,
         loading,
         status
      } = useNavigation(length)

      // Dynamic styles <
      const cls = [
         classes.container,
         classes[colorSchema],
         classes[contentPosition],
         classes[layout]
      ]

      const listCls: string[] = []

      if (status === FetchStatus.NO_DATA)
         listCls.push(classes.empty_list)
      else
         listCls.push(classes.list)

      if (extLarge && elements && elements.length === 3)
         listCls.push(classes.proper_row_for_three)
      // Dynamic styles />

      const renderList = () => {
         if (arr && !arr.length)
            return (
               <OpacityYDiv>
                  <h1>No elements added yet</h1>
               </OpacityYDiv>
            )

         if (arr)
            return arr.map(el =>
               <MainCard
                  basket={basket}
                  key={el.slug}
                  card={el}
                  colorSchema={colorSchema}
                  contentPosition={contentPosition}
               />
            )

         if (status === FetchStatus.NO_DATA) return (
            <OpacityYDiv>
               <h1>No elements added yet</h1>
            </OpacityYDiv>
         )

         if (status === FetchStatus.INIT || loading) {
            let cardCount = 1

            return (
               Array.from(Array(cardCount)).map((el, i) => (
                  <MainCardSkeleton
                     key={i}
                     contentPosition={'column'}
                     type={'article'}
                  />
               ))
            )
         }

         return elements.map(el => (
            <MainCard
               basket={basket}
               colorSchema={colorSchema}
               contentPosition={contentPosition}
               key={el.slug}
               card={el}
            />
         ))
      }

      useEffect(() => {
         const vh = window.innerHeight

         if (status !== FetchStatus.INIT) {
            if (large)
               document.body.scroll(0, vh * .25)
            else
               document.body.scroll(0, vh * .602)
         }
      }, [page])

      return (
         <div className={cls.join(' ')}>
            { title &&
               <OpacityDiv
                  className={classes.title}
                  whileInViewport
               >
                  <h3>{title}</h3>
               </OpacityDiv>
            }

            <div className={listCls.join(' ')}>
               {renderList()}
            </div>
         </div>
      )
   }

export default List