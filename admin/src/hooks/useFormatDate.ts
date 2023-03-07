import {useMemo} from "react";


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

const useFormatDate = (date: Date | undefined | string | number) => {
   return useMemo(() => {
      let properDate: Date

      if (date === undefined)
         return ''

      if (typeof date === 'string' || typeof date === 'number') {
         properDate = new Date(date)
      } else {
         properDate = date
      }

      const day = properDate.getDate()
      const month = properDate.getMonth()
      const year = properDate.getFullYear()

      return `${day} ${months[month]} ${year}`
   }, [date])
}

export default useFormatDate