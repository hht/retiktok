import React, {useCallback, useRef, useState, useEffect} from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  useAnimatedScrollHandler
} from 'react-native-reanimated'
import moment from 'dayjs'
import {
  PanGestureHandler,
  NativeViewGestureHandler
} from 'react-native-gesture-handler'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  InteractionManager
} from 'react-native'
import {useQuery} from 'react-query'
import {
  API,
  COLORS,
  CommentProps,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  opacity,
  QUERY
} from '../utils'
import SafeBottomArea from './SafeBottomArea'
import ActivityIndicator from './ActivityIndicator'

const renderItem = ({item}: {item: CommentProps}) => (
  <View style={styles.item}>
    <View style={[styles.avatar, {backgroundColor: item.avatar}]} />
    <View style={styles.comment}>
      <Text style={styles.em}>{item.author}</Text>
      <Text style={styles.content}>{item.comment}</Text>
      <Text style={styles.em}>{moment(item.createdAt).format('MM-DD')}</Text>
    </View>
  </View>
)

const keyExtractor = (comment: CommentProps) => comment.id

const AnimatedList = Animated.createAnimatedComponent(FlatList)
export default ({
  toggleSheetShown,
  visible
}: {
  toggleSheetShown: Function
  visible: boolean
}) => {
  const panHandlerRef = useRef()
  const scrollHandlerRef = useRef()

  const translateY = useSharedValue(0)
  const scrollViewOffset = useSharedValue(0)
  const prevTranslationY = useSharedValue(0)

  const [t, refersh] = useState(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollViewOffset.value = event.contentOffset.y
    }
  })
  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      prevTranslationY.value = 0
    },
    onActive: (event) => {
      if (scrollViewOffset.value <= 0) {
        translateY.value = event.translationY - prevTranslationY.value
      } else {
        prevTranslationY.value = event.translationY
      }
    },
    onEnd: () => {
      translateY.value = withTiming(0)
    }
  })
  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(visible ? DEVICE_HEIGHT * 0.25 : DEVICE_HEIGHT),
      transform: [
        {
          translateY: Math.max(0, translateY.value)
        }
      ]
    }
  })
  const onClose = useCallback(() => toggleSheetShown(false), [])
  const {data} = useQuery([QUERY.COMMENTS], API.getComments)
  return (
    <>
      {visible ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={styles.backdrop}
        />
      ) : null}
      <PanGestureHandler
        ref={panHandlerRef}
        simultaneousHandlers={scrollHandlerRef}
        onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {data?.length ? `${data.length} Comments` : 'Loading...'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onClose}
              style={styles.cross}>
              <Image
                style={styles.image}
                source={require('../assets/images/cross.png')}
              />
            </TouchableOpacity>
          </View>
          <NativeViewGestureHandler
            ref={scrollHandlerRef}
            simultaneousHandlers={panHandlerRef}>
            <AnimatedList
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              data={data ?? []}
              ListEmptyComponent={ActivityIndicator}
              renderItem={renderItem}
              scrollEventThrottle={16}
              style={styles.list}
              contentContainerStyle={styles.container}
              onScroll={scrollHandler}
            />
          </NativeViewGestureHandler>
          <SafeBottomArea color={COLORS.black} />
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.75,
    zIndex: 10,
    backgroundColor: 'transparent'
  },

  header: {
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.primary,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700'
  },
  cross: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 12,
    height: 12,
    resizeMode: 'contain'
  },
  backdrop: {width: DEVICE_WIDTH, height: DEVICE_HEIGHT, zIndex: 1},
  list: {flex: 1, backgroundColor: COLORS.primary},
  container: {flexGrow: 1, justifyContent: 'center'},

  item: {
    padding: 16,
    flexDirection: 'row',
    width: '100%'
  },
  avatar: {
    width: 36,
    height: 36,
    marginRight: 16,
    borderRadius: 18,
    marginTop: 12
  },
  comment: {
    flex: 1
  },
  content: {
    color: COLORS.white,
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '500'
  },
  em: {
    color: opacity(0.6, COLORS.white),
    marginVertical: 8,
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '500'
  }
})
