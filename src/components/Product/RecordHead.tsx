import React, {FC} from "react"
import Head from "next/head"


interface IProps {
   title: string
   text: string
}

const RecordHead: FC<IProps> = ({ title, text }) => {
   return (
      <Head>
         <meta name='description' content={text}/>
         <title>
            {title} | &nbsp;
            {
               text.length > 38
                  ? `${text.slice(0, 38)}...`
                  : text
            }
         </title>
      </Head>
   )
}

export default RecordHead