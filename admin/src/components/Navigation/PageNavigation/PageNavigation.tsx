import {FC} from "react"
import classes from './PageNavigation.module.sass'


interface IProps {
   nextPageClick: () => void
   prevPageClick: () => void
   page: number
   pagesCount: number
   disable: boolean
}

const PageNavigation: FC<IProps> = ({ disable, nextPageClick, prevPageClick, page, pagesCount }) => {
   return (
      <div className={classes.navigation_container}>
         <div className={classes.btns_container}>
            {page > 1 && (
               <div
                  className={classes.btn_wrapper}
                  onClick={!disable ? prevPageClick : () => {}}
               >
                  <div className={classes.prev_arrow}/>

                  <div className={classes.btn_text}>
                     Назад
                  </div>
               </div>
            )}

            {page < pagesCount && (
               <div
                  onClick={!disable ? nextPageClick : () => {}}
                  className={classes.btn_wrapper}
               >
                  <div className={classes.btn_text}>
                     Вперед
                  </div>

                  <div className={classes.next_arrow}/>
               </div>
            )}
         </div>
      </div>
   )
}

export default PageNavigation