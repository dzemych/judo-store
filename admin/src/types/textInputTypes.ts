import React from "react"


export type IChangeInputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export interface ITextInput {
   key: string
   label: string
   helperText?: string
   changeHandler: (e: IChangeInputEvent) => void
   value: string
   error?: boolean
   rows?: number
   type?: 'text' | 'password' | 'number'
   multiline?: boolean
}