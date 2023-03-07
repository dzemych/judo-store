export interface ICardItem {
   mainPhoto: string
   title: string
   slug: string
   afterTitle?: string
   beforeTitle?: string
   text?: string
   date?: Date | undefined
}