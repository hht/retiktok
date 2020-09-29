import React, {useEffect, useRef, useState} from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated'
import {interpolateColor} from 'react-native-redash'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  Image
} from 'react-native'
import {COLORS, DEVICE_HEIGHT, DEVICE_WIDTH} from '../utils'
import {SafeBottomArea} from '.'

const AnimatedBackdrop = Animated.createAnimatedComponent(TouchableOpacity)
export default ({visible}: {visible: boolean}) => {
  const shared = useSharedValue(0)
  const inputRef = useRef<any>()
  const height = useSharedValue<number>(0)
  const [keyboardShown, toggleKeyboardShown] = useState(false)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      // bottom: visible ? 0 :
      bottom: height.value,
      backgroundColor: interpolateColor(
        shared.value,
        [0, 1],
        [COLORS.black, COLORS.white]
      )
    }
  })
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(keyboardShown ? 0.2 : 0)
    }
  })
  useEffect(() => {
    shared.value = withTiming(keyboardShown ? 1 : 0)
    if (!keyboardShown) {
      inputRef?.current?.blur()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardShown])

  const keyboardWillShow = (e) => {
    height.value = withTiming(e?.endCoordinates?.height)
  }
  const keyboardWillHide = () => {
    height.value = withTiming(0)
  }

  useEffect(() => {
    const KeyboardShowSubscriber = Keyboard.addListener(
      'keyboardWillShow',
      keyboardWillShow
    )
    const KeyboardHideSubscriber = Keyboard.addListener(
      'keyboardWillHide',
      keyboardWillHide
    )

    return () => {
      KeyboardShowSubscriber.remove()
      KeyboardHideSubscriber.remove()
    }
  }, [])

  return (
    <>
      {keyboardShown ? (
        <AnimatedBackdrop
          activeOpacity={1}
          onPress={() => toggleKeyboardShown(false)}
          style={[styles.backdrop, backdropStyle]}
        />
      ) : null}

      {visible ? (
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <SafeBottomArea color={COLORS.transparent}>
            <TextInput
              ref={inputRef}
              placeholder="Please input your message"
              placeholderTextColor={COLORS.secondary}
              style={styles.input}
              onFocus={() => toggleKeyboardShown(true)}
            />
            {keyboardShown ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.btn}>
                <Image
                  style={styles.image}
                  source={require('../assets/images/send.png')}
                />
              </TouchableOpacity>
            ) : null}
          </SafeBottomArea>
        </Animated.View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    width: DEVICE_WIDTH,
    zIndex: 20,
    backgroundColor: 'transparent',
    left: 0,
    bottom: 0
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    zIndex: 20,
    backgroundColor: COLORS.black,
    opacity: 0
  },
  input: {
    height: 36,
    alignItems: 'center',
    paddingHorizontal: 16,
    flex: 1
  },
  list: {flex: 1, backgroundColor: COLORS.primary},
  btn: {width: 36, height: 36, justifyContent: 'center', alignItems: 'center'},
  image: {width: 16, height: 16}
})
