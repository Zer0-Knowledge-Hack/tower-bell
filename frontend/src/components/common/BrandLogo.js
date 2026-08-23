import { Image, Platform, StyleSheet, View } from 'react-native'

const owl = require('../../../assets/owl-tower.jpg')

export function BrandLogo({ size = 72, framed = true }) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, !framed && styles.flat]}>
      <Image
        source={owl}
        style={[styles.image, Platform.OS === 'web' ? { imageRendering: 'pixelated' } : null]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#020617',
    borderWidth: 2,
    borderColor: '#1CFFFF',
    borderRadius: 0
  },
  flat: {
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
