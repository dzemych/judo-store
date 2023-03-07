import BaseLayout from "../components/forms/BaseLayout"
import React from "react"
import DataBase from "../components/data/DataBase";
import {DataTypes} from "../types/dataTypes";
import AboutForms from "../components/data/AboutForms";


const About = () => {
   return (
      <BaseLayout>
         <DataBase
            key={'about-edit'}
            dataType={DataTypes.ABOUT}
            title={'О нас'}
            // @ts-ignore
            // Props will be added in this component (this was made for not repeating all submit
            // actions and status states that invokes different popup based on forms answer)
            children={<AboutForms/>}
         />
      </BaseLayout>
   )
}

export default About