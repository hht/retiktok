import React, {FC} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {COLORS} from '../utils'

const Widget: FC<{color?: string}> = ({
  children,
  color = COLORS.transparent
}) => (
  <SafeAreaView style={[styles.footer, {backgroundColor: color}]}>
    <View style={[styles.bottom, {backgroundColor: color}]}>{children}</View>
  </SafeAreaView>
)

export default Widget

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.black
  },
  bottom: {
    height: 48,
    flexDirection: 'row',
    width: '100%'
  }
})
