import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Icon } from 'react-native-elements';
import { SERVER_URL } from '../utils/consts';
import { primary } from '../utils/colors';
import { useNavigation } from '@react-navigation/native';

const TimelineItem = ({ event, onEdit, onDelete }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleDetails = () => {
        setExpanded(!expanded);
    };

    const handleDelete = async () => {
        // Format the date and time
        const dateTime = new Date(event.eventdate); // Assuming event.eventdate is in the format "YYYY-MM-DD HH:MM:SS"
        const formattedDate = `${dateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${dateTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`;
    
        // Determine what to display (Title or Type)
        const displayInfo = event.typeofevent === 'custom' ? event.titleofevent : event.typeofevent;
    
        Alert.alert(
            "Confirm Event Deletion",
            `\nAre you sure you want to delete the event of ${displayInfo} scheduled for ${formattedDate}?`,
            
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${SERVER_URL}/events/${event.eventid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    // Include authentication headers if needed
                                }
                            });

                            if (response.ok) {
                                onDelete(event); // Update UI on success
                            } else {
                                throw new Error('Failed to delete the event');
                            }
                        } catch (error) {
                            console.error('Error deleting event:', error);
                            Alert.alert('Error', 'Failed to delete the event');
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={styles.timelineItem}>
            <View style={styles.eventMainInfo}>
                <Text style={styles.timeText}>
                    {new Date(event.eventdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.eventTitle}>
                    {event.typeofevent === 'custom' ? event.titleofevent : event.typeofevent}
                </Text>
                <View style={styles.buttonsContainer}>
                    {event.details && event.details.trim() !== '' && (
                        <TouchableOpacity onPress={toggleDetails} style={styles.infoButton}>
                            <Icon name="info" type="feather" size={20} color="#007AFF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => onEdit(event)} style={styles.editButton}>
                        <Icon name="edit" type="feather" color="#4CAF50" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                        <Icon name="delete" type="feather" color="#F44336" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            {expanded && (
                <Text style={styles.detailsText}>{event.details}</Text>
            )}
        </View>
    );
};

const fetchEvents = async (petId, selectedDate, setEvents) => {
  try {
    const formattedDate = selectedDate.split('T')[0]; // Asumăm că data este în format ISO string și o ajustăm
    console.log(formattedDate);
    const response = await fetch(`${SERVER_URL}/events/${petId}/date/${formattedDate}`);
    if (response.ok) {
      const data = await response.json();
      setEvents(data);
    } else {
      throw new Error('Failed to fetch events for the specific date');
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    Alert.alert('Error', 'Failed to fetch events for the specific date');
  }
};
const EventCalendarWithTimeline = ({ petId }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTimeline, setShowTimeline] = useState(true);
  

  useEffect(() => {
      if (petId && selectedDate) {
          fetchEvents(petId, selectedDate, setEvents);
      }
  }, [petId, selectedDate]);

  const handleDayPress = (day) => {
      setSelectedDate(day.dateString);
      setShowTimeline(true);
  };

  const changeWeek = (amount) => {
      let currentDate = new Date(selectedDate);
      currentDate.setDate(currentDate.getDate() + amount);
      setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const getWeekDays = (selectedDate) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let currentDate = new Date(selectedDate);
    const currentDayOfWeek = currentDate.getDay();
    const offset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    currentDate.setDate(currentDate.getDate() + offset);

    let week = [];
    for (let i = 0; i < 7; i++) {
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + i);
        week.push({
            dateStr: newDate.toISOString().split('T')[0],
            dayOfWeek: daysOfWeek[(newDate.getDay() === 0 ? 7 : newDate.getDay()) % 7]
        });
    }
    return week;
};

const renderWeekDays = () => {
    const weekDays = getWeekDays(selectedDate);
    return weekDays.map((day, index) => (
        <TouchableOpacity key={index} style={styles.dayItem} onPress={() => setSelectedDate(day.dateStr)}>
            {day.dateStr === selectedDate && <View style={styles.dot}></View>}
            <Text style={styles.dayOfWeekText}>{day.dayOfWeek}</Text>
            <Text style={styles.dayText}>{new Date(day.dateStr).getDate()}</Text>
        </TouchableOpacity>
    ));
};


const renderEvents = () => {
  const navigation = useNavigation();
  
  return events.map((event, index) => (
    <TimelineItem 
      key={index} 
      event={event} 
      onEdit={() => navigation.navigate('EditEvent', { eventId: event.eventid })}
      onDelete={() => fetchEvents(petId, selectedDate, setEvents)}
    />
  ));
};

  return (
      <View style={{ flex: 1 }}>
          {!showTimeline ? (
             <Calendar
             current={selectedDate}
             onDayPress={handleDayPress}
             markedDates={{
                 [selectedDate]: {
                     selected: true,
                     selectedColor: primary,
                 }
             }}
             firstDay={1}
             // Customize the appearance
             theme={{
                 backgroundColor: '#ffffff',
                 calendarBackground: '#ffffff',
                 textSectionTitleColor: '#b6c1cd',
                 textSectionTitleDisabledColor: '#d9e1e8',
                 selectedDayBackgroundColor: primary,
                 selectedDayTextColor: '#ffffff',
                 todayTextColor: '#00adf5',
                 dayTextColor: '#2d4150',
                 textDisabledColor: '#d9e1e8',
                 dotColor: primary,
                 selectedDotColor: '#ffffff',
                 arrowColor: primary,
                 disabledArrowColor: '#d9e1e8',
                 monthTextColor: primary,
                 indicatorColor: primary,
                 textDayFontWeight: '300',
                 textMonthFontWeight: 'bold',
                 textDayHeaderFontWeight: '300',
                 textDayFontSize: 14,
                 textMonthFontSize: 14,
                 textDayHeaderFontSize: 14
             }}
         />
         
          ) : (
              <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                      <Icon name="chevron-left" onPress={() => changeWeek(-7)} />
                      <TouchableOpacity onPress={() => setShowTimeline(false)}>
                          <Text>Open Calendar</Text>
                      </TouchableOpacity>
                      <Icon name="chevron-right" onPress={() => changeWeek(7)} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
                      {renderWeekDays()}
                  </View>
                  <ScrollView style={{ flex: 1 }}>
                      {renderEvents()}
                  </ScrollView>
              </View>
          )}
      </View>
  );
};
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
        justifyContent: 'space-between', // Ensure equal spacing
      
      },
      dayItem: {
        flex: 1, // Each day item should flex equally
        height: 50,
        width:50,
        justifyContent: 'center',
        alignItems: 'center',
      },
        timelineContainer: {
          flex: 1,
        },
        weekNavigatorContainer: {
          flexDirection: 'column', // Ensures the navigator and day selector are stacked vertically
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
            width:50,
            borderRadius: 50, // Asigură rotunjirea (ajustabil în funcție de design)
            backgroundColor: primary, // Culoarea bulinei
            opacity: 0.5, // Opțional: o transparență pentru a vedea textul de sub
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
      // Ensure the ScrollView that holds the events has minimal padding/margin
      eventsScrollView: {
        flex: 1,
        marginTop: 0, // Ensure there's no extra space on top of the events list
      },
  
    
    
});

export default EventCalendarWithTimeline;


