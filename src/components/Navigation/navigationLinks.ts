export interface ILink {
   to: string,
   text: string
}

export const links: ILink[] = [
   { to: '/', text: 'Home' },
   { to: '/basket', text: 'Basket' },
   { to: '/about', text: 'About us' },
   { to: '/contacts', text: 'Contacts' },
]