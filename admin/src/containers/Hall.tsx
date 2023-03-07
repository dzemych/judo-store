import BaseLayout from "../components/forms/BaseLayout";
import React from "react";
import HallForms from "../components/data/HallForms";
import DataBase from "../components/data/DataBase";
import {DataTypes} from "../types/dataTypes";


const Hall = () => {
   return (
      <BaseLayout>
         <DataBase
            key={'hall-edit'}
            dataType={DataTypes.HALL}
            title={'Зал'}
            // @ts-ignore
            // Props will be added in this component (this was made for not repeating all submit
            // actions and status states that invokes different popup based on forms answer)
            children={<HallForms/>}
         />
      </BaseLayout>
   )
}

export default Hall