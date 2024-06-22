import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '../utils/ColorSchemeContext';
import lightLogo from '../assets/images/white_logo.png';
import darkLogo from '../assets/images/black_logo.png';

const { width, height } = Dimensions.get('window'); 

const LogoHeader = () => {
  const scheme = useColorScheme();
  const logo = scheme === 'dark' ? darkLogo : lightLogo; 

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.2, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.8, 
    height: width * 0.4, 
    resizeMode: 'contain', 
  },
});

export default LogoHeader;
