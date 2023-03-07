import {FC} from "react"
import classes from './Button.module.sass'


interface IProps {
   children: string | React.ReactNode,
   color: 'white' | 'black'
   onClick?: () => void
}


const Button: FC<IProps> =
   ({
       children,
       color= 'white',
       onClick
   }) => {

   const cls = [classes.container]

   if (color === 'black')
      cls.push(classes.black)

   if (color === 'white')
      cls.push(classes.white)

   return (
      <button
         className={cls.join(' ')}
         onClick={onClick}
      >
         <span>
            {children}
         </span>
      </button>
   )
}

export default Button