import {FC} from "react"
import OpacityYDiv from "@components/UI/OpacityYDiv";
import classes from 'src/assets/styles/404.module.sass'


const Custom404: FC = () => {
   return (
      <OpacityYDiv className={classes.container}>
         <h1>Сторінку не знайдено</h1>

         <div className={classes.hr}/>

         <h1>404</h1>
      </OpacityYDiv>
   )
}

export default Custom404