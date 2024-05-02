import React from 'react';
import { View, useColorScheme } from 'react-native';
import { Colors } from './colors';

const withDefaultMargins = (Component) => {
  function WithDefaultMargins(props) {
    // Get the current color scheme ('light' or 'dark')
    const scheme = useColorScheme();
    console.log(scheme);
    // Define colors for light and dark themes
    const backgroundColor = Colors[scheme].background;

    return (
      <View style={{ backgroundColor: backgroundColor, flex: 1 }}> 
        <View style={{ marginTop: 53,  flex: 1 }}>
          <Component {...props} />
        </View>
      </View>
    );
  };

  return WithDefaultMargins;
};

export default withDefaultMargins;
