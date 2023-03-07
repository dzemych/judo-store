import {FC} from "react";
import {CircularProgress} from "@mui/material";


interface IProps {
   styles?: React.CSSProperties
}

const Loader: FC<IProps> = ({ styles = {} }) => {
   return (
      <div style={{
         width: '100%',
         height: '100%',
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         ...styles
      }}>
         <CircularProgress/>
      </div>
   )
}

export default Loader