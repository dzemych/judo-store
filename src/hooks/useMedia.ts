import {useEffect, useMemo, useState} from "react"


interface IBreakpoints {
   extSmall: boolean
   small: boolean
   medium: boolean
   large: boolean
   extLarge: boolean
   vw: number
}

const initialBreakPoints: IBreakpoints = {
   extSmall: false,
   small: false,
   medium: false,
   large: false,
   extLarge: false,
   vw: 0
}

const useMedia = (): IBreakpoints => {
   const xs = 0
   const sm = 600
   const md = 900
   const lg = 1200
   const xl = 1536

   const [vw, setVw] = useState(0)
   const handleResize = () => setVw(window.innerWidth)

   const [breakpoints, setBreakpoints] = useState<IBreakpoints>(initialBreakPoints)

   const extSmall = useMemo(() => breakpoints.extSmall, [breakpoints.extSmall])
   const small = useMemo(() => breakpoints.small, [breakpoints.small])
   const medium = useMemo(() => breakpoints.medium, [breakpoints.medium])
   const large = useMemo(() => breakpoints.large, [breakpoints.large])
   const extLarge = useMemo(() => breakpoints.extLarge, [breakpoints.extLarge])

   // * Handle window resize
   useEffect(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
   }, [])

   useEffect(() => {
      setBreakpoints(() => {
         const newBreakpoints = {...initialBreakPoints}

         if (vw >= xs)
            newBreakpoints.extSmall = true

         if (vw >= sm)
            newBreakpoints.small = true

         if (vw >= md)
            newBreakpoints.medium = true

         if (vw >= lg)
            newBreakpoints.large = true

         if (vw >= xl)
            newBreakpoints.extLarge = true

         return newBreakpoints
      })
   }, [vw])

   return { extSmall, small, medium, large, extLarge, vw }
}

export default useMedia