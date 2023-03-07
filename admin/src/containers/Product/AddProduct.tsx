import React, {FC} from "react"
import ProductBase from "../../components/article/ProductBase"
import ProductForms from "../../components/article/ProductForms"
import BaseLayout from "../../components/forms/BaseLayout";


const AddProduct: FC = () => {

   return (
      <BaseLayout>
         <ProductBase
            key={'product-add'}
            title={'Add product'}
            type={'create'}
            // @ts-ignore
            // Props will be added in this component (this was made for not repeating all submit
            // actions and status states that invokes different popup based on forms answer)
            children={<ProductForms/>}
         />
      </BaseLayout>
   )
}

export default AddProduct