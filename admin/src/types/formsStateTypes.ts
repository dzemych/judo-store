import {IChangeInputEvent} from "./textInputTypes";

export interface ObjStrKeys {[k: string]: any}

export type FormsChangeHandler =
   (key: string) =>
      (e: undefined | IChangeInputEvent, val?: any) =>
         void

export type FormsStateHook = <T extends ObjStrKeys>(initialState: T, item?: T, ) => {
   formsState: T
   handleFormsChange: FormsChangeHandler
   isValid: () => Promise<boolean> | boolean
   formErrors: any
   getFormData: (prevState?: any) => FormData
   getFilteredState: (prev?: any) => ObjStrKeys
   formsLoading: boolean
}

export type ITelState = string[]

export type TelChangeHandler = (key: number) => (val: string) => void

export type TelStateHook = (initialState?: []) => {
   telState: ITelState,
   telStateErrors: boolean[]
   isValidTelState: () => boolean
   handleTelChange: TelChangeHandler
   addOneTel: () => void
   deleteOneTel: (key: number) => () => void
}