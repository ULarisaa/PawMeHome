import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../utils/colors';

export const usePetsStyles = () => {
  const scheme = useColorScheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: Colors[scheme].background, // Aici era greșeala
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors[scheme].text, 
        textAlign: 'center', 
    },    
    label: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors[scheme].text,
        marginBottom:10,
      },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      padding: 13,
      backgroundColor: Colors[scheme].inputBackground, // Adaugă fundal pentru input
      color: Colors[scheme].text, // Și textul inputului să urmărească schema
    },
    imageContainer: {
      position: 'relative',
      justifyContent: 'center', 
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
      marginVertical: 20,
      borderRadius: 100,

    },
    icon: {
      position: 'absolute',
      width: 24,
      height: 24,
    },
    editIcon: {
      right: "27%",
      bottom: 10,
    },
    deleteIcon: {
      right: "27%",
      top: 10,
    },
    button: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10, // Ajustează în funcție de necesități
    },
    createEventButton: {
      color: primary,
    },
    createText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[scheme].text,
    },
    textinvisible:{
      color: Colors[scheme].background,
    },
  
      

  });

  return styles;
};
