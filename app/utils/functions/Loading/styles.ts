import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../ColorSchemeContext';
import { Colors } from '../../colors';

export const useDynamicStyles = () => {
    const scheme = useColorScheme();
    // Folosește 'light' ca fallback dacă scheme este null sau undefined
    const backgroundColor = Colors[scheme].background;
    

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[scheme].background, 
    },
    logoContainer: {
      width: 150, 
      height: 150, 
      overflow: 'hidden',
      position: 'relative',
    },
    logo: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    cover: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors[scheme].background, 
    },
  });

  return styles;
};
