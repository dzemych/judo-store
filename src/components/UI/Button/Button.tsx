import {CSSProperties, FC} from "react"
import classes from './Button.module.sass'


interface IProps {
   children: string | React.ReactNode,
   color: 'white' | 'black'
   onClick?: () => void
   style?: CSSProperties
}


const Button: FC<IProps> =
   ({
       children,
       color = 'white',
       onClick,
       style
   }) => {

   const cls = [classes.container]

   if (color === 'black')
      cls.push(classes.black)

   if (color === 'white')
      cls.push(classes.white)

   return (
      <button
         style={style}
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