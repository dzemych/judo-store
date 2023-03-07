import {FC} from "react"
import classes from './Loader.module.sass'
import belt from '@images/belt.png'


const Loader: FC = () => {
   return (
      <div className={classes.container}>
         <div className={classes.img_container}>
            <img
               src={belt.src}
               alt=""
            />
         </div>
      </div>
   )
}

export default Loader