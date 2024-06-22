import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import { Colors, primary } from '../../assets/colors';

export const usePetProfileStyles = () => {
  const scheme = useColorScheme();
  
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: Colors[scheme].background,
    },
    textinvisible:{
      color: Colors[scheme].background,
    },
    buttonEnabled: {
      backgroundColor: 'gray', 
  },
  buttonDisabled: {
      backgroundColor: primary,
  },
    containerSettings: {
      marginTop:10,
      flex: 1,
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
    backgroundColor: Colors[scheme].inputBackground, 
    color: Colors[scheme].text, 
    marginBottom:10,
  },
 
    inputDetails: {

      minHeight: 100, 
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 5,
      padding: 12,
      fontSize:16,
      textAlignVertical: 'top', 
      backgroundColor: Colors[scheme].inputBackground, 
      color: Colors[scheme].text, 
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
    text: {
      color: Colors[scheme].text,
      marginLeft: 10,
      fontSize: 16,
    },
    createText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[scheme].text,
      textAlign:'center',
    },
    description: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
      color: Colors[scheme].textBox,
    },
    mapContainer: {
      marginTop:10,
      width: '100%',
      height: '70%',
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 20,
    },
  
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    buttonsRow: {
      flexDirection: 'row',

      marginVertical: 10,
    },
    button: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10, 
      color: Colors[scheme].text, 
    },
    activeButton: {
      borderBottomWidth: 2, 
      borderBottomColor: primary,
    },
    buttonText: {
      color: 'grey',
    },
    selectedButtonText: {
      color: primary,
    },
    selectedButton: {
      borderBottomWidth: 2,
      borderBottomColor: primary,
    },
    settingsContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    eventItem: {
      backgroundColor: '#f9f9f9', 
      padding: 10,
      marginVertical: 5, 
      borderRadius: 5,
      flexDirection: 'row', 
      justifyContent: 'space-between', 
    },
    eventDate: {
      fontWeight: 'bold',
    },
    eventDescription: {
      color: '#333', 
    },
    create: {
      backgroundColor: primary,
      padding: 15,
      borderRadius: 5,
      marginVertical: 10, 
      width: '100%', 
      alignItems: 'center', 
    },
    createEventButton: {
      color: primary,
      marginLeft:20,
      marginRight:20,
    },
    attachButton: {
      color: primary,
      textAlign:'center',
    },
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: Colors[scheme].text,
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'gray',
      borderRadius: 8,
      color: Colors[scheme].text,
      paddingRight: 30, 
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
      color: '#333',
      marginTop: 20,
      marginBottom: 10,
    },
    eventItemList: {
      backgroundColor: '#ffffff', 
      padding: 15,
      borderRadius: 5,
      shadowColor: '#000', 
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 4, 
      marginBottom: 10, 
    },
    eventDateList: {
      fontSize: 16,
      color: '#666', 
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
      color: '#555', 
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
      justifyContent: 'space-between',
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
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingVertical: 5,
      paddingHorizontal: 20, 
    },
    dayLabel: {
      flex: 1,
      fontSize: 16, 
      color: Colors[scheme].text,
    },
    Container: {
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      marginVertical: 10,
    },
    infoContainer: {
      marginBottom: 10,
    },
    infoItem: {
      marginBottom: 5,
    },
    infoText: {
      fontWeight: 'bold',
    },
    distanceText: {
      fontSize: 16,
    },
    safeText: {
      color: 'green',
    },
    notSafeText: {
      color: 'red',
    },
  });

  return styles;
};
