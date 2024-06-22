import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors } from '../../assets/colors';

export const useColorStyles = () => {
  const scheme = useColorScheme();
  
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      height: '35%',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      justifyContent: 'space-between',
    },
    eventListContainer: {
      paddingHorizontal: 10, 
    },
    titleContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    
    
    eventButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      fontWeight: 'bold',
    },

    colorPreview: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    eventLabel: {
      fontSize: 16,
      color: Colors[scheme].text,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign:'center',
      color: Colors[scheme].text,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1001,
      marginBottom:20,
    },
    saveButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: Colors[scheme].primary,
      borderRadius: 5,
      alignSelf: 'center',
    },
    saveButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
    },
    modalDescription: {
      color: '#000',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 10,
    },
  });
};
