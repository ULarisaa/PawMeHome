// styles.ts
import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../utils/colors';

export const usePetProfileStyles = () => {
  const scheme = useColorScheme();
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: Colors[scheme].background,
    },
    pickerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors[scheme].text,
      marginTop: 16,
      marginBottom: 10,
    },
    iconColor:{
      color: Colors[scheme].text,
    },
    textColor:{
      color: Colors[scheme].text,

    },
    
    input: {
      width: '100%',
      fontSize:16,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 12,
      backgroundColor: Colors[scheme].inputBackground, // Adaugă fundal pentru input
      color: Colors[scheme].text, // Și textul inputului să urmărească schema
    },
    inputDetails: {
      // Stiluri pentru inputul de detalii, care permite mai multe linii
      minHeight: 100, // Înălțimea minimă inițială, ajustabilă în funcție de conținut
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 5,
      padding: 12,
      fontSize:16,
      textAlignVertical: 'top', // Pentru ca textul să înceapă de sus
      backgroundColor: Colors[scheme].inputBackground, // Adaugă fundal pentru input
      color: Colors[scheme].text, // Și textul inputului să urmărească schema
    },
    picker: {
      width: '80%',
      backgroundColor: 'gray',
      marginBottom: 20,
    },
    
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginBottom: 20,
    },
    name: {
      marginLeft:10,
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[scheme].text,
    },
    createtext: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    description: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
      color: Colors[scheme].textBox,
    },
    mapContainer: {
      width: '100%',
      height: 400,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 20,
    },
    distanceText: {
      fontSize: 16, // De exemplu, mărimea fontului
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    button: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10, // Ajustează în funcție de necesități
    },
    activeButton: {
      borderBottomWidth: 2, // Lățimea liniei de subliniere
      borderBottomColor: primary,
    },
    buttonText: {
      color: 'grey',
    },
    selectedButtonText: {
      color: primary,
    },
    settingsContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    eventItem: {
      backgroundColor: '#f9f9f9', // Fundal deschis pentru fiecare element de eveniment
      padding: 10,
      marginVertical: 5, // Spațiu vertical între elementele listei
      borderRadius: 5,
      flexDirection: 'row', // Afișează data și descrierea evenimentului pe aceeași linie
      justifyContent: 'space-between', // Maximizarea spațiului între data și descrierea evenimentului
    },
    eventDate: {
      fontWeight: 'bold',
    },
    eventDescription: {
      color: '#333', // O nuanță mai închisă pentru text
    },
    create: {
      backgroundColor: primary,
      padding: 15,
      borderRadius: 5,
      marginVertical: 10, // Spațiu vertical între butoane
      width: '100%', // Butonul va ocupa lățimea containerului minus padding
      alignItems: 'center', // Centrează textul pe orizontală
    },
    createEventButton: {
      color: primary,
    },
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: Colors[scheme].text,
      paddingRight: 30, // pentru a se asigura că textul nu se suprapune peste iconița de jos
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: Colors[scheme].text,
      paddingRight: 30, // pentru a se asigura că textul nu se suprapune peste iconița de jos
    },
    eventTypeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333', // Darker text for better readability
      marginTop: 20,
      marginBottom: 10,
    },
    eventItemList: {
      backgroundColor: '#ffffff', // White background for event items
      padding: 15,
      borderRadius: 5,
      shadowColor: '#000', // Shadow for depth
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4, // Elevation for Android
      marginBottom: 10, // Space between event items
    },
    eventDateList: {
      fontSize: 16,
      color: '#666', // Lighter text for the date
      marginBottom: 5,
    },
    eventInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventType: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#444',
      marginBottom: 5,
    },
    eventDetails: {
      marginTop: 5,
      fontSize: 16,
      color: '#555', // Detail text color
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Acesta va împinge elementele la extremități
      marginBottom: 10,
    },
    
    searchBar: {
      padding: 10,
      fontSize: 16,
      backgroundColor: '#f0f0f0',
      margin: 10,
      borderRadius: 20,
    },
    searchSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      margin: 10,
    },
    searchIcon: {
      padding: 10,
    },
    Searchinput: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: '#f0f0f0',
      color: '#424242',
      borderRadius: 20,
    },
    dayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between', // This ensures the text and switch are on opposite ends
      alignItems: 'center', // This centers them vertically
      paddingVertical: 5, // Adds vertical padding for better spacing
      paddingHorizontal: 20, // Adds horizontal padding for better spacing
    },
    dayLabel: {
      flex: 1, // Takes all available space pushing the switch to the end
      fontSize: 16, // Example font size, adjust as needed
      color: Colors[scheme].text,
    },
    
    
  });

  return styles;
};
