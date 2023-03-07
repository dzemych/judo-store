import {Dispatch, FC, SetStateAction} from "react"
import classes from './SortBar.module.sass'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {ObjStrKeys} from "../../types/formsStateTypes";


interface IProps {
   state: any
   setState: Dispatch<SetStateAction<any>>
}

const SortBar: FC<IProps> = ({ state, setState }) => {

   const changeState = (key: keyof typeof state) => () => {
      setState((prev: ObjStrKeys) => ({ ...prev, [key]: prev[key as string] > 0 ? -1 : 1 }))
   }

   const sortFields = [
      {
         key: 'createdAt',
         iconUp: <ArrowUpwardIcon/>,
         iconDown: <ArrowDownwardIcon/>,
         text: "Дата створення"
      }
   ]

   return (
      <div className={classes.container}>
         <span className={classes.title}>
            Сортувати
         </span>

         <div className={classes.vert_div} style={{ marginRight: 80 }}/>

         {sortFields.map(el => (
            <div key={el.key} className={classes.sort_field}>
               <div className={classes.icon_container} onClick={changeState(el.key as keyof typeof state)}>
                  { state[el.key as keyof typeof state] > 0
                     ? el.iconDown
                     : el.iconUp
                  }
               </div>

               <span>
                  {el.text}
               </span>
            </div>
         ))}

      </div>
   )
}

export default SortBar