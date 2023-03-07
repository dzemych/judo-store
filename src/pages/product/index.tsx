import React, {FC, useEffect} from "react"
import {useRouter} from "next/router"


const Blog: FC = () => {
   const router = useRouter()

   useEffect(() => {
      router.push('/')
   }, [])

   return null
}

export default Blog