

type IHook = () => {
   isEmail: (val: string) => boolean,
   isTel: (val: string) => boolean
}

const useFormsValidator: IHook = () => {

   const isEmail = (val: string) => {
      return !!val
         .toLowerCase()
         .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         )
   }

   const isTel = (val: string) => {
      return !!val
         .toLowerCase()
         .match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
   }

   return { isEmail, isTel }
}

export default useFormsValidator