import {FC} from "react"
import classes from './PersonSmallCard.module.sass'
import AnimatedImg from "@components/UI/AnimatedImg"
import OpacityYDiv from "@components/UI/OpacityYDiv"
import {useRouter} from "next/router"
import {ArticleType} from "../../types/content/article"


interface IProps {
   position: string
   photoSrc: string
   slug: string
}

const PersonSmallCard: FC<IProps> = ({ position, photoSrc, slug }) => {

   const router = useRouter()

   const onClick = () => router.push(`${ArticleType.WORKER}/${slug}`)

   return (
      <div className={classes.container} onClick={onClick}>
         <div className={classes.wrapper}>
            <div className={classes.img_container}>
               <AnimatedImg photoSrc={photoSrc} whileInViewport/>
            </div>

            <OpacityYDiv className={classes.position} delay={.2} whileInViewport>
               {position}
            </OpacityYDiv>
         </div>
      </div>
   )
}

export default PersonSmallCard