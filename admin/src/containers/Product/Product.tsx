import {FC} from "react";
import List from "../../components/List/List";
import ListLayout from "../../layout/ListLayout";


const Product: FC = () => {

   return (
      <ListLayout title={'Products'}>
         <List/>
      </ListLayout>
   )
}

export default Product