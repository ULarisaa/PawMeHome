import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import withDefaultMargins from '../../utils/Margins';
import { useColorScheme } from '../../utils/ColorSchemeContext'; 
import { getStyles } from './styles'; 

const Settings = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const styles = getStyles(scheme); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
};

export default withDefaultMargins(Settings);
