import React, {FC, useContext, useEffect, useState} from 'react'
import classes from './Sidebar.module.sass'
import {useRouter} from "next/router"
import {AnimatePresence, motion} from "framer-motion"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faInstagram, faViber, faFacebook, faTelegram} from "@fortawesome/free-brands-svg-icons"
import {AppContext} from "../../../store/appContext"
import {ILink, links} from "@components/Navigation/navigationLinks"
import {useAppSelector} from "../../../hooks/useRedux"


interface IProps {
   isOpen: boolean,
}

const Sidebar: FC<IProps> = ({ isOpen = undefined }) => {

   const socialLinks = useAppSelector(state => state.socialLinksReducer)
   const { toggleNewPage, setSidebar, isSidebar } = useContext(AppContext)
   const [state, setState] = useState('init')

   const bottomVariants = {
      inactive: {
         opacity: 0,
         y: 40
      },
      active: {
         y: 0,
         opacity: 1,
         transition: {
            delay: .4,
            duration: .4,
            transitionTimingFunction: 'cubic-bezier(.3,0,.5,1)',
            type: 'tween'
         }
      },
      exit: {
         opacity: 0,
         transition: {
            duration: .2,
            ease: 'linear'
         }
      }
   }

   const liVariants = {
      inactive: {
         scale: .7,
         opacity: 0,
      },
      active: (custom: number) => ({
         scale: 1,
         opacity: 1,
         transition: {
            delay: .3 + custom * .05,
            duration: .5,
            transitionTimingFunction: 'cubic-bezier(.25,.1,.25,1)'
         }
      }),
      exit: {
         opacity: 0,
         transition: {
            duration: .3,
         }
      }
   }

   const router = useRouter()

   const onLinkClick = (e: React.MouseEvent<Element, MouseEvent>, to: string) => {
      e.preventDefault()

      toggleNewPage()
      setSidebar(false)

      router.push(to)
   }

   const renderLi = (el: ILink, i: number) => {
      return (
         <motion.li
            variants={liVariants}
            custom={i}
            key={i + el.text}
            initial='inactive'
            animate='active'
            exit='exit'
         >
            <a
               onClick={e => onLinkClick(e, el.to)}
               className={classes.listLink}
               style={{ color: router.pathname === el.to ? 'white': '#878a8f' }}
            >
               {el.text}
            </a>
         </motion.li>
      )
   }

   const renderIcon = (icon: typeof faTelegram, url: string) => (
      <div className={classes.icon_container}>
         <a href={url} target="_blank" rel='noreferrer'>
            <FontAwesomeIcon icon={icon}/>
         </a>
      </div>
   )

   const cls = [classes.container]

   if (isSidebar && state !== 'init')
      cls.push(classes.open)

   if (!isSidebar && state !== 'init')
      cls.push(classes.close)

   if (state === 'init')
      cls.push(classes.init)

   useEffect(() => {
      if (isOpen)
         setState('active')
   }, [isSidebar])

   return (
      <div className={cls.join(' ')}>
         <AnimatePresence mode='wait'>
            { isSidebar &&
               <div className={classes.wrapper}>
                  <div className={classes.list_container}>
                     <ul>
                        {links.map((link, i) => renderLi(link, i))}
                     </ul>
                  </div>

                  <motion.div
                     className={classes.bottom_icons}
                     variants={bottomVariants}
                     key={'icons'}
                     initial='inactive'
                     animate='active'
                     exit='exit'
                  >
                     { socialLinks?.instagram && renderIcon(faInstagram, socialLinks.instagram) }
                     { socialLinks?.facebook && renderIcon(faFacebook, socialLinks.facebook) }
                     { socialLinks?.viber && renderIcon(faViber, socialLinks.viber) }
                     { socialLinks?.telegram && renderIcon(faTelegram, socialLinks.telegram) }
                  </motion.div>

                  <motion.div
                     key={'author'}
                     className={classes.bottom_notation}
                     onClick={() => { window.open('https://www.linkedin.com/in/dzemych/') }}
                     variants={bottomVariants}
                     initial='inactive'
                     animate='active'
                     exit='exit'
                  >
                     © {new Date().getFullYear()}&nbsp;
                     <span className={classes.author_name}>Dzemych Ivan</span>
                  </motion.div>
               </div>
            }
         </AnimatePresence>
      </div>
   )
}

export default Sidebar