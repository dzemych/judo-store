   import React, {FC, useContext} from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import CustomEditor from './editorConfig'
import classes from "./Editor.module.sass"
import TempImgContext from "../../../context/tempImgContext"


interface IProps {
   error?: boolean
   state: string
   changeHandler: (e: React.ChangeEvent<HTMLInputElement>, val: any) => void
}

const Editor: FC<IProps> = (props: IProps ) => {

   const { uploadUrl } = useContext(TempImgContext)

   return (
      <>
         <div style={{
            border: props.error ? '1px solid #d32f2f' : '1px solid gray',
            borderRadius: '2px'
         }}>
            <CKEditor
               editor={ CustomEditor }
               data={props.state}
               config={{
                  simpleUpload: {
                     // The URL that the images are uploaded to.
                     uploadUrl: uploadUrl,
                     // Enable the XMLHttpRequest.withCredentials property.
                     withCredentials: false,
                  }}
               }
               onChange={ ( event, editor ) => {
                  const newState = editor.getData()

                  props.changeHandler(event, newState)
               } }
            />
         </div>

         { props.error &&
            <p className={classes.editor_error}>Це поле не може бути пустим</p>
         }
      </>
   )
}

export default Editor