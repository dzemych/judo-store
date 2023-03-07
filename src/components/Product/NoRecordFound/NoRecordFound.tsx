import {FC} from "react"
import classes from './NoRecordFound.module.sass'
import OpacityYDiv from "@components/UI/OpacityYDiv"


interface IProps {
   title?: string
}

const NoRecordFound: FC<IProps> = ({ title = "Запис не найдено" }) => {
   return (
      <OpacityYDiv className={classes.container}>
         <h1>{title}</h1>
      </OpacityYDiv>
   )
}

export default NoRecordFound