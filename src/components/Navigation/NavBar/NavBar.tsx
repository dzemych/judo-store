import React, {FC} from "react"
import classes from './NavBar.module.sass'
import OpacityDiv from "@components/UI/OpacityDiv"
import {useRouter} from "next/router"
import {ILink, links} from "@components/Navigation/navigationLinks"


const NavBar: FC = () => {
   const router = useRouter()

   const goTo = (to: string) => () => router.push(to)

   const renderLink = (el: ILink, idx: number) => {
      const cls = [classes.link_container]

      if (router.pathname === el.to)
         cls.push(classes.active_link)

      return (
         <div
            className={cls.join(' ')}
            key={el.to + idx}
            onClick={goTo(el.to)}
         >
            <a> {el.text} </a>

            <div className={classes.left_curtain}/>
            <div className={classes.right_curtain}/>
         </div>
      )
   }
   return (
      <OpacityDiv className={classes.container}>
         <nav className={classes.wrapper}>
            { links.map((el, i) => renderLink(el, i)) }
         </nav>
      </OpacityDiv>
   )
}

export default NavBar