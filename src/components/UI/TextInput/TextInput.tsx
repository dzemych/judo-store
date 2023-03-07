import {ChangeEvent, FC, SyntheticEvent} from "react"
import classes from './TextInput.module.sass'
import {ITextInput} from "../../../types/form.types"


const TextInput: FC<ITextInput> = (
   {
      onChange,
      value,
      onSubmit,
      error,
      title,
      placeholder = 'Start typing...',
   }) => {

   const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      onChange(e.target.value)
   }

   const submitHandler = (e: SyntheticEvent) => {
      e.preventDefault()
      onSubmit()
   }

   return (
      <div className={classes.container}>
         <label htmlFor={title}> {title} </label>
         <input
            name={title}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={changeHandler}
            onSubmit={submitHandler}
         />
         <div className={classes.error}> {error} </div>
      </div>
   )
}

export default TextInput