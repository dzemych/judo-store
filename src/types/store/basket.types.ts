import {PayloadAction} from "@reduxjs/toolkit"

interface IBasketListItem {
   slug: string
   amount: number
}

export interface BasketState {
   list: IBasketListItem[],
}

export type strPayload = PayloadAction<string>
export type numPayload = PayloadAction<number>