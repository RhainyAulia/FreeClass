import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const HeaderLogo = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/FREECLASS_SEC_LOGO.png')}
      style={styles.logo}
    />
  </View>
);

export default HeaderLogo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 240,
    height: 50,
    resizeMode: 'contain',
  },
});
