import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../utils/colors';

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
    text: {
      color: Colors[scheme].text,
      marginLeft: 10,
      fontSize: 16,
    },
    timerText: {
      color: '#666',
      textAlign: 'center',
      marginTop: 10,
      fontSize: 16,
  },
  resendButton: {
    marginTop:20,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center', // Center the text inside the button
    justifyContent: 'center',
},

resendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
},
textEnabled: {
    color:primary,
},
textDisabled: {
    color: '#666666', 
},
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
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
    codeInput: {
      width: 40,  // Lățimea fiecărui input pentru a se potrivi unei cifre
      borderBottomWidth: 2,  // Subliniază fiecare căsuță pentru un aspect curat
      borderColor: 'gray',
      textAlign: 'center',
      fontSize: 18,  // Mărește fontul pentru lizibilitate
      marginHorizontal: 5,  // Spațiu între căsuțe
      color: Colors[scheme].text,
  },
  
  });

  return styles;
};
