import { StyleSheet } from 'react-native';
import { useColorScheme } from '../../utils/ColorSchemeContext'; 
import { Colors, primary } from '../../assets/colors';

export const calendarTheme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: primary, 
    selectedDayTextColor: '#ffffff',
    todayTextColor: primary,
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    arrowColor: primary, 
    disabledArrowColor: '#d9e1e8',
    monthTextColor: primary, 
    indicatorColor: primary, 
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 14,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
};

export const useCalendarstyles = () => {
    const scheme = useColorScheme();
    const styles = StyleSheet.create({
        timelineItem: {
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            marginVertical: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        addButtonContainer: {
            alignItems: 'flex-end', 
            paddingRight: 10, 
            paddingBottom: 10, 
          },
          addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: primary,
            borderRadius: 30,
            paddingVertical: 10,
            paddingHorizontal: 15,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          addButtonText: {
            marginLeft: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#FFF',
          },
        createEventButton: {
            color: Colors[scheme].text, 
            marginLeft:20,
            marginRight:20,
          },
          button: {
            flex: 1, 
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10, 
          },
        eventMainInfo: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        timeText: {
            marginRight: 10,
            fontSize: 18,
            color: '#555',
        },
        eventTitle: {
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            color: '#333',
        },
        buttonsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        infoButton: {
            marginRight: 10,
        },
        editButton: {
            marginRight: 10,
        },
        deleteButton: {
            marginRight: 5,
        },
        detailsText: {
            paddingVertical: 5,
            paddingHorizontal: 10,
            color: '#666',
            fontStyle: 'italic',
        },
        weekDaysContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between', 
        },
        dayItem: {
            flex: 1, 
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        timelineContainer: {
            flex: 1,
        },
        weekNavigatorContainer: {
            flexDirection: 'column', 
        },
        weekNavigator: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
        },
        openCalendarButton: {
            padding: 5,
        },
        dot: {
            position: 'absolute',
            height: 50,
            width: 50,
            borderRadius: 50, 
            backgroundColor: primary, 
            opacity: 0.5,
        },
        dayText: {
            fontSize: 16,
        },
        selectedDay: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        dayOfWeekText: {
            fontSize: 14,
            color: '#666',
        },
        eventsScrollView: {
            flex: 1,
            marginTop: 0, 
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        attachmentLink: {
            fontSize: 16,
            color: '#007AFF',
            marginBottom: 5,
        },
        closeButton: {
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1001,
            marginBottom:20,
          },
        closeButtonText: {
            color: '#fff',
            fontSize: 16,
        },
        attachButton: {
            color: primary,
            textAlign:'center',
          },
          attachmentContainer: {
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
        },
        attachmentTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
        },

        
    });
    return styles;
};
