import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import logo from '../utils/images/logo.jpg'

const LogoHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120, // Adjust the height as needed
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Optional: change the background color as needed
  },
  logo: {
    width: 300, // Adjust the width as per your logo's aspect ratio
    height: 150, // Adjust the height as per your logo's aspect ratio
    resizeMode: 'contain', // Ensures the logo scales nicely
  },
});

export default LogoHeader;
