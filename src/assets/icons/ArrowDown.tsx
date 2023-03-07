import {FC} from "react";

interface IProps {
   className: string
}

const ArrowDown: FC<IProps> = ({ className }) => {
   return (
      <svg
         className={className}
         width="24"
         height="24"
         xmlns="http://www.w3.org/2000/svg"
      >
         <path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/>
      </svg>
   )
}

export default ArrowDown