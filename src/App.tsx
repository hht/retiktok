/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {BottomSheet, VideoSwiper} from './components'

const App = () => {
  const [sheetShown, toggleSheetShown] = useState(false)
  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoSwiper toggleSheetShown={toggleSheetShown} />
      <BottomSheet visible={sheetShown} toggleSheetShown={toggleSheetShown} />
    </View>
  )
}

export default App
