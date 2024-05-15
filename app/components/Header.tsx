import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useColorScheme } from '../utils/ColorSchemeContext';
import lightLogo from '../utils/images/white_logo.png'
import darkLogo from '../utils/images/black_logo.png'

const LogoHeader = () => {
  const scheme = useColorScheme(); // Obținem schema de culori curentă
  const logo = scheme === 'dark' ? darkLogo : lightLogo; // Alege logo-ul în funcție de tema

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 170, // Ajustează înălțimea după necesitate
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 400, // Ajustează lățimea conform raportului de aspect al logo-ului
    height: 180, // Ajustează înălțimea conform raportului de aspect al logo-ului
    resizeMode: 'contain', // Asigură scalarea frumoasă a logo-ului
  },
});

export default LogoHeader;
