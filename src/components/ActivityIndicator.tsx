import React from 'react'
import {ActivityIndicator, View, StyleSheet} from 'react-native'
import {COLORS} from '../utils'
export default () => (
  <View style={styles.empty}>
    <ActivityIndicator size="large" color={COLORS.secondary} />
  </View>
)

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
