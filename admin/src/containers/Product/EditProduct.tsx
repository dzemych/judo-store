import React, {FC} from "react"
import ProductBase from "../../components/article/ProductBase"
import BaseLayout from "../../components/forms/BaseLayout"
import ProductForms from "../../components/article/ProductForms"


const EditProduct: FC = () => {
   return (
      <BaseLayout>
         <ProductBase
            key={'blog-edit'}
            title={'Блог'}
            type={'update'}
            // @ts-ignore
            // Props will be added in this component (this was made for not repeating all submit
            // actions and status states that invokes different popup based on forms answer)
            children={<ProductForms/>}
         />
      </BaseLayout>
   )
}

export default EditProduct