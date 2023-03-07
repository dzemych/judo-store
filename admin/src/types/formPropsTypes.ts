import {DataTypes} from "./dataTypes";

export interface ItemFormProps {
   submitHandler: (formData: FormData | string) => void
   deleteHandler?: () => void
   item?: any
}

export interface DataFormProps {
   item?: any
   submitHandler: (formData: FormData) => void
   dataType: DataTypes
}