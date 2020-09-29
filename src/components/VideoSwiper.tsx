import React, {useState, useEffect, useRef, memo} from 'react'
import {useQuery} from 'react-query'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import Video from 'react-native-video'
import {
  API,
  QUERY,
  DEVICE_WIDTH,
  VideoProps,
  COLORS,
  DEVICE_HEIGHT,
  opacity
} from '../utils'

const Description = ({item}: {item: VideoProps}) => (
  <View style={styles.description}>
    <Text style={styles.author}>{`@${item.author}`}</Text>
    <Text style={styles.title}>{item.title}</Text>
  </View>
)

const MessageButton = memo(({onPress}: {onPress: Function}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      onPress(true)
    }}
    style={styles.btn}>
    <Image
      style={styles.image}
      source={require('../assets/images/message.png')}
    />
  </TouchableOpacity>
))

const VideoItem = memo(
  ({
    item,
    paused,
    toggleSheetShown
  }: {
    item: VideoProps
    paused: boolean
    toggleSheetShown: Function
  }) => (
    <View style={styles.video}>
      <Video
        source={{uri: item.playaddr}}
        poster={item.coverurl}
        style={styles.video}
        paused={paused}
        resizeMode="cover"
        repeat
      />
      <Description item={item} />
      <MessageButton onPress={toggleSheetShown} />
    </View>
  )
)

const Widget = ({toggleSheetShown}: {toggleSheetShown: Function}) => {
  const {data} = useQuery(QUERY.VIDEOS, API.getVideos)
  const [current, setCurrent] = useState<VideoProps | undefined>(undefined)
  const viewabilityConfig = useRef({
    minimumViewTime: 5,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true
  })
  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: any}) => {
      const [viewableItem] = viewableItems
      setCurrent((prev) => viewableItem?.item ?? prev)
    }
  )
  useEffect(() => {
    setCurrent(data?.[0])
  }, [data])
  return (
    <View style={StyleSheet.absoluteFill}>
      <FlatList
        renderItem={({item}: {item: VideoProps}) => (
          <VideoItem
            item={item}
            paused={current?.hotindex !== item?.hotindex}
            toggleSheetShown={toggleSheetShown}
          />
        )}
        pagingEnabled
        data={data}
        keyExtractor={(item) => `${item.hotindex}`}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </View>
  )
}

export default Widget

const styles = StyleSheet.create({
  video: {width: DEVICE_WIDTH, height: DEVICE_HEIGHT},
  description: {
    position: 'absolute',
    left: 32,
    bottom: 32,
    width: DEVICE_WIDTH / 2,
    backgroundColor: opacity(0.3, COLORS.primary),
    padding: 8,
    borderRadius: 8
  },
  author: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    lineHeight: 32
  },
  title: {
    fontSize: 12,
    color: COLORS.white,
    lineHeight: 20
  },
  btn: {
    width: 64,
    height: 64,
    position: 'absolute',
    right: 16,
    bottom: DEVICE_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 48,
    height: 48
  }
})
