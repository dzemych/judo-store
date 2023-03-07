import {Dayjs} from "dayjs";

export interface ProductState {
   title: string
   price: number
   mainPhoto: null | File | string
   afterTitle: string
   beforeTitle: string
   text: string
   date: null | Dayjs
   content: undefined | string
   photos?: string[]
   _id?: string
}

export interface AboutState {
   title: string
   photos: Array<null | File | string>
   content: undefined | string
}

export interface HallState {
   title: string
   address: string
   text: string
   mainPhoto: null | File | string
   photos: Array<null | File | string>
   _id?: string
}

export interface ContactsState {
   tel: string
   email: string
   instagram: string
   viber: string
   facebook: string
   address: string
   location: [number, number] | undefined
}