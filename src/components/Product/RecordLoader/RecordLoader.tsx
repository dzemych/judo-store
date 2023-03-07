import {FC} from "react"
import Loader from "@components/Loader/Loader"
import classes from './RecordLoader.module.sass'


const RecordLoader: FC = () => {
   return (
      <div className={classes.container}>
         <Loader/>
      </div>
   )
}

export default RecordLoader