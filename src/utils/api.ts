import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

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
      console.log((data?.newslist ?? []).map((it) => it.playaddr))
      return data?.newslist ?? []
    })
  await AsyncStorage.setItem('@videos', JSON.stringify(videos))
  return videos
}
