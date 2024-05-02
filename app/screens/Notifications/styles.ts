// NotificationsStyles.ts
import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../utils/colors';

export const useNotificationStyles = () => {
  const scheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      marginTop:10,
      flex: 1,
      backgroundColor: Colors[scheme].background,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[scheme].box,
      padding: 8, // Ajustat pentru a controla spațiul din interiorul containerului
      marginBottom: 12, // Mărit pentru a adăuga spațiu între elemente
      marginHorizontal: 8, // Adaugă o margine laterală pentru a lasa spațiu la marginile ecranului
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
