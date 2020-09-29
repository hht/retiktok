import React, {useCallback, useRef} from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  useAnimatedScrollHandler
} from 'react-native-reanimated'
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
  SafeAreaView,
  Image
} from 'react-native'
import {COLORS, DEVICE_HEIGHT, DEVICE_WIDTH} from '../utils'

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const renderItem = ({item}) => (
  <View style={{height: 100}}>
    <Text>{item}</Text>
  </View>
)

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
      top: withTiming(visible ? DEVICE_HEIGHT * 0.4 : DEVICE_HEIGHT),
      transform: [
        {
          translateY: Math.max(0, translateY.value)
        }
      ]
    }
  })
  const onClose = useCallback(() => toggleSheetShown(false), [])
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
            <Text style={styles.title}>500条评论</Text>
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
              keyExtractor={(item) => `${item}`}
              data={data}
              renderItem={renderItem}
              scrollEventThrottle={16}
              style={styles.list}
              onScroll={scrollHandler}
            />
          </NativeViewGestureHandler>
          <SafeAreaView style={styles.footer}>
            <View style={styles.bottom} />
          </SafeAreaView>
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.6,
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
    color: COLORS.white
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
  footer: {
    backgroundColor: COLORS.black
  },
  bottom: {
    height: 48
  }
})
