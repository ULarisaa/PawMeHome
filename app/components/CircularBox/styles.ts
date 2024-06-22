import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors } from '../../assets/colors';

export const useCircularBoxStyles = () => {
  const scheme = useColorScheme();
  const styles = StyleSheet.create({
    circle: {
      width: 130,
      height: 130,
      borderRadius: 75,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[scheme].circle,
      margin: 20,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 75,
    },
    name: {
      position: 'absolute',
      bottom: -20,
      textAlign: 'center',
      color: Colors[scheme].text,
    },
    plus: {
      fontSize: 24,
      color: Colors[scheme].background,
    },
  });

  return styles;
};
