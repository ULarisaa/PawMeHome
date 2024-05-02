import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors } from '../../utils/colors';

export const useLoginStyles = () => {
  const scheme = useColorScheme(); 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[scheme].background,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 20,
      color: Colors[scheme].text,
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: Colors[scheme].inputBackground,
      color: Colors[scheme].text,
    },
    button: {
      marginTop: 20,
      width: '100%',
      backgroundColor: Colors[scheme].primary,
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: Colors[scheme].background,
      textAlign: 'center',
      marginRight: 5
    },
    buttonGText: {
      color: Colors[scheme].googleBText,
      textAlign: 'center',
      marginRight: 5
    },
    linkText: {
      color: Colors[scheme].primary,
      textAlign: 'center',
    },
    errorText: {
      marginTop: 10,
      color: 'red', 
    },
    googleButton: {
    marginTop: 32,
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      backgroundColor: Colors[scheme].background,
      borderWidth: 0.5,
      borderColor: 'gray',
      height: 40,
      borderRadius: 5,

      justifyContent: 'center',
    },
    logo: {
      padding: 10,
      margin: 5,
      height: 20,
      width: 20,
      resizeMode: 'cover',
      backgroundColor: Colors[scheme].background,
    },
    disabled: {
      backgroundColor: '#EEEEEE',
    },
  });

  return styles;
};
