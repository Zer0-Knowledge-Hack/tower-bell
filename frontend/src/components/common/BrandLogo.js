import { Image, StyleSheet, View } from 'react-native';

export function BrandLogo({ size = 72, framed = true }) {
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.22),
        },
        !framed && styles.flat,
      ]}
    >
      <Image source={require('../../../assets/owl.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  flat: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
