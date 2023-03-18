import {ArticleType, IArticleCard} from "./content/article"
import {FetchStatus} from "./status"


export type NavigationHook = (length: number) => {
   page: number
   pagesCount: number
   elements: IArticleCard[]
   loading: boolean
   status: FetchStatus
   loadMore: () => void
}
