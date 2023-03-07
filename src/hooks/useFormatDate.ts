import {useMemo} from "react"


const months = [
   'Січня',
   'Лютого',
   'Березня',
   'Квітня',
   'Травня',
   'Червня',
   'Липня',
   'Серпня',
   'Вересня',
   'Жовтня',
   'Листопада',
   'Грудня'
]

type IFunction = (date?: Date | string | number) => null | string

const useFormatDate: IFunction = (date) => {
   return useMemo(() => {
      if (!date) return null

      let dateVal = date

      if (typeof dateVal === 'string' || typeof dateVal === 'number')
         dateVal = new Date(dateVal)

      const day = dateVal.getDate()
      const month = dateVal.getMonth()
      const year = dateVal.getFullYear()

      return `${day} ${months[month]} ${year}`
   }, [date])
}

export default useFormatDate