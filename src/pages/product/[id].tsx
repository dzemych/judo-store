import {useRouter} from "next/router"
import {FC} from "react"
import Product from "@components/Product/Product/Product"


const BlogArticle: FC = () => {

   const router = useRouter()
   const { id } = router.query

   return (
      <Product slug={id as string}/>
   )
}

export default BlogArticle