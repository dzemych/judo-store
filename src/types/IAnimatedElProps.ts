import React, {CSSProperties} from "react"
import {MotionStyle} from "framer-motion";


export interface IAnimatedElProps {
   children?: React.ReactNode,
   className?: string
   style?: CSSProperties | MotionStyle
   whileInViewport?: boolean
   onClick?: (e?: any) => void
   delay?: number
   colorSchema?: 'black' | 'white'
   exit?: boolean
   id?: string
   showAnimation?: boolean
   duration?: number
   hoverAnimation?: boolean
}