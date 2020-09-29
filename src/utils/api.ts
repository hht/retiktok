import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Mock, {Random} from 'mockjs'

const TIKTOK_KEY = '87f40afb91228b90a32b2670cdc96b91'

export const getVideos = async () => {
  const value = await AsyncStorage.getItem('@videos')
  if (value !== null) {
    return JSON.parse(value)
  }
  const videos = await axios
    .get('http://api.tianapi.com/txapi/dyvideohot/index', {
      params: {key: TIKTOK_KEY}
    })
    .then(({data}) => {
      return data?.newslist ?? []
    })
  await AsyncStorage.setItem('@videos', JSON.stringify(videos))
  return videos
}

export const getComments = async () => {
  return await Mock.mock({
    'data|10-50': [
      {
        'author|+1': () => Random.name(),
        comment: () => Random.title(),
        createdAt: () => Random.now('month'),
        id: () => Random.guid(),
        avatar: () => Random.color()
      }
    ]
  }).data
}
