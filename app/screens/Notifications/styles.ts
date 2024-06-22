import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../assets/colors';

export const useNotificationStyles = () => {
  const scheme = useColorScheme();

  const styles = StyleSheet.create({
    highlightedNotification: {
      backgroundColor: '#d3f8d3', 
    },

      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
      },
      petIconContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign:'center',
      },
      modalTimestamp: {
        marginBottom: 25,
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      deleteButton: {
  
        bottom: 10,
        width: '100%',
        alignItems: 'center',
      },
      detailsContainer: {
        marginBottom: 20,
      },
     
    
    container: {
      marginTop:10,
      flex: 1,
      backgroundColor: Colors[scheme].background,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[scheme].box,
      padding: 8, 
      marginBottom: 12, 
      marginHorizontal: 8, 
      borderRadius: 10,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
      },
      
    unreadIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: 'red',
      marginRight: 6,
    },
    notificationType: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors[scheme].textBox, 
    },
    notificationMessage: {
      fontSize: 16,
      marginVertical: 5,
      color: Colors[scheme].textBox, 
    },
    notificationTimestamp: {
      fontSize: 12,
      color: Colors[scheme].timebox,
    },
    button: {
      padding: 10,
      width: "50%",
      alignItems: "center",
    },
    selectedButton: {
      borderBottomWidth: 2,
      borderBottomColor: primary,
    },
    buttonText: {
      color: 'grey',

    },
    selectedButtonText: {
      color: primary,
    },
    petIcon: {
       
            width: 60,
            height: 60,
            borderRadius: 100,
      },
  });


  return styles;
};
