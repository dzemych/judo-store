import classes from './MainCardSkeleton.module.sass'
import {FC} from "react"


interface IProps {
   contentPosition?: 'row' | 'column'
   type?: 'person' | 'article'
}

const MainCardSkeleton: FC<IProps> = ({ contentPosition = 'column', type = 'article' }) => {

   const cls = [classes[contentPosition], classes[type]]
   const imgCls = [classes.img_container, classes.pulse]

   return (
      <div className={cls.join(' ')}>
         <div className={classes.wrapper}>

            <div className={imgCls.join(' ')}/>

            <div className={classes.content_container}>
               <div className={classes.before}/>
               <div className={classes.title} />
               <div className={classes.after}/>

               <div className={classes.btn}/>
            </div>

         </div>
      </div>
   )
}

export default MainCardSkeleton