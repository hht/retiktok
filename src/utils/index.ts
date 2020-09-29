import {Dimensions} from 'react-native'
import * as API from './api'

export {QUERY, COLORS} from './constants'

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get('window')

export {API, DEVICE_WIDTH, DEVICE_HEIGHT}

export interface VideoProps {
  hotindex: number
  duration: number
  playaddr: string
  coverurl: string
  title: string
  author: string
  avatar: string
}
export interface CommentProps {
  id: string
  author: string
  comment: string
  createdAt: string
  avatar: string
}

export const opacity = (opaci: number, color: string): string => {
  const red = parseInt(color.substring(1, 3), 16)
  const green = parseInt(color.substring(3, 5), 16)
  const blue = parseInt(color.substring(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, ${opaci})`
}
