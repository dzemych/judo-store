import DataBase from "../components/data/DataBase";
import {DataTypes} from "../types/dataTypes";
import BaseLayout from "../components/forms/BaseLayout";
import React from "react";
import ContactsForm from "../components/data/ContactsForm";


const Contacts = () => {
   return (
      <BaseLayout>
         <DataBase
            key={'contacts-edit'}
            dataType={DataTypes.CONTACTS}
            title={'Контакти'}
            // @ts-ignore
            // Props will be added in this component (this was made for not repeating all submit
            // actions and status states that invokes different popup based on forms answer)
            children={<ContactsForm/>}
         />
      </BaseLayout>
   )
}

export default Contacts