export interface IArticleCard {
   to: string
   title: string
   mainPhoto: string
   backPhoto: string
   slug: string,
   price: number
   beforeTitle?: string
   afterTitle?: string
   text?: string
   date?: Date
}

export enum ArticleCardContent {
   NORMAL = 'normal',
   UP = 'moved_up',
   PADDINGS = 'with_paddings',
   ROW = 'row_content',
   TALL_IMG = 'tall_img'
}

export enum ArticleCardTheme {
   WHITE_FILLED = 'white_filled',
   WHITE_TRANSPARENT = 'white_transparent',
   BLACK_TRANSPARENT = 'black_transparent'
}

export enum ArticleType {
   BLOGS = 'blog',
   WORKER = 'worker',
}

export interface IArticleState {
   backPhoto: string
   title: string
   description?: string
   price?: string | number
   content?: string
   photos?: string[]
   photosList?: string[]
}