export type CheckFunctionWithKey = (key: string) => boolean
export type CheckFunction = (key?: string) => boolean
export type UniqueCheckFunction = (
   key: string,
   recordType: 'update' | 'create',
) => Promise<boolean> | boolean

export type IsValidFunction = (key: string, recordType: 'update' | 'create')
   => Promise<boolean> | boolean

export type ValidCheckerHook = (formsState: any) => {
   longerThanTwo: CheckFunctionWithKey
   notEmpty: CheckFunction
   isEmail: CheckFunction
   isPhone: CheckFunction
   titleCheck: CheckFunctionWithKey
   isUnique: UniqueCheckFunction
   loading: boolean
   checkFormsValid: IsValidFunction
}