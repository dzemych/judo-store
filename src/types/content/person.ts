import {ISocialLinksState} from "../store/socialLilnks.types"


export interface IPersonState {
   position: string
   name: string
   surname: string
   patronymic?: string
   positionType: 'worker' | 'sportsman'
   mainPhoto?: string
   backPhoto?: string
   mediaLinks?: ISocialLinksState
   birth?: Date | number | string
   content?: string
   photosList?: string[]
   tel?: string
   email?: string
}