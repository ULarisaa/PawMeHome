import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import withDefaultMargins from '../../utils/Margins'; // Presupunem că aceasta este o funcție HOC pentru stiluri
import { usePetProfileStyles } from './styles'; // Asigurați-vă că această cale este corectă
import { primary } from '../../utils/colors'; // Verificați și această cale
import { ScrollView } from 'react-native-gesture-handler';
import { SERVER_URL } from '../../utils/consts';
import {  useAuth } from '../../utils/functions/AuthContext';
import TestNotificationButton from '../../utils/functions/TestNotificationButton';
import { useNotificationToken } from '../../utils/functions/NotificationTokenContext';

const CreateEvent = () => {
  const { currentUser } = useAuth();

useEffect(() => {
  if (currentUser && currentUser.token) {
    console.log("Logged in with token:", currentUser.token);
  }
}, [currentUser]);

const { expoPushToken } = useNotificationToken();
console.log(expoPushToken);
  const [eventType, setEventType] = useState('');
  const [eventLabel, setEventLabel] = useState('');
  const [titleOfEvent, setTitleOfEvent] = useState('');
  const [eventTypeTime, setEventTypeTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminder, setReminder] = useState(false); // Adăugarea stării pentru Switch
  const [reminderTime, setReminderTime] = useState('onTime');
  const [reminderType, setReminderType] = useState('once');
  const [details, setDetails] = useState('');
  const [selectedDays, setSelectedDays] = useState({});
  const route = useRoute();
  const items = [
    { label: "Doctor's Appointment", value: 'doctor' },
    { label: 'Vaccination', value: 'vaccination' },
    { label: 'Medication', value: 'medication' },
    { label: 'Custom', value: 'custom' },
  ];
  const formatDateAndTime = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',     // 2-digit day
      month: 'long',      // Full month name
      year: 'numeric',    // Full numeric year
      hour: '2-digit',    // 2-digit hour
      minute: '2-digit',  // 2-digit minute
      hour12: false       // 24-hour format without AM/PM
    });
  };
  const daysOfWeek = [
    { label: 'Every Monday', value: 'monday' },
    { label: 'Every Tuesday', value: 'tuesday' },
    { label: 'Every Wednesday', value: 'wednesday' },
    { label: 'Every Thursday', value: 'thursday' },
    { label: 'Every Friday', value: 'friday' },
    { label: 'Every Saturday', value: 'saturday' },
    { label: 'Every Sunday', value: 'sunday' },
  ];
  const createNotification = async (notificationData) => {
    try {
        const response = await fetch(`${SERVER_URL}/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData)
        });

        if (response.ok) {
            const notificationResult = await response.json();
            return {
                success: true,
                data: notificationResult
            };
        } else {
            const errorResult = await response.json();
            return {
                success: false,
                message: errorResult.error || 'Failed to create notification'
            };
        }
    } catch (error) {
        console.error('Error in creating notification:', error);
        return {
            success: false,
            message: 'Network or server error'
        };
    }
};


  

  const handleChange = (value) => {
    // Find the item that matches the selected value
    const item = items.find(item => item.value === value);
    setEventType(value);
    if (item) {
      setEventLabel(item.label);
    } else {
      setEventLabel(''); // Reset or handle the empty state as necessary
    }
  };
const { petId } = route.params;


  const styles = usePetProfileStyles();
  const navigation = useNavigation();

  const createEvent = async () => {
    try {
        const eventBody = {
          petid: petId,
          eventType: eventType,
          titleofevent: titleOfEvent || '',
          eventdate: date,
          details: details
      };
      

        const response = await fetch(`${SERVER_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventBody),
       
        });
        console.log(response);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            Alert.alert("Success", "Event created successfully");

            if (reminder) {
              try {
                  const formattedDate = formatDateAndTime(new Date(date)); // Ensure this function is correctly defined/imported
          
                  const notificationData = {
                      pet_id:petId,
                      user_token: expoPushToken,
                      message: `${eventLabel} on ${formattedDate}`,
                      type: 'reminder',
                      remindertime: reminderTime,
                      details:details,
                      reminder:reminder,
                      reminder_type: reminderType,
                      selectedDays: Object.keys(selectedDays).filter(day => selectedDays[day]),
                      start_date:date,
                      event_id: result.eventid
                  };
          
                  const notificationResult = await createNotification(notificationData);
                  if (notificationResult.success) {
                      console.log('Notification created successfully');
                  } else {
                      console.error('Failed to create notification:', notificationResult.message);
                  }
              } catch (error) {
                  console.error('Error creating notification:', error);
              }
          }
          

            navigation.goBack(); // Navigate back
        } else {
            throw new Error('Something went wrong with event creation');
        }
    } catch (error) {
      console.error('Request failed:', error);
      Alert.alert("Error", "Failed to create event: " + (error.message || error));
  }
  
};

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSelectPast = () => {
    setEventTypeTime('past');
    setShowPicker(true);
  };

  const handleSelectFuture = () => {
    setEventTypeTime('future');
    setShowPicker(true);
  };
  const toggleDay = (day) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  return (

     <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
   <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
        <Icon name="arrow-back" size={24} color={styles.createEventButton.color} />
          <Text style={styles.createEventButton}>Back</Text>
        </TouchableOpacity>
    
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.createtext}>Create Event</Text>
        </View>
    
        <TouchableOpacity
            onPress={createEvent}
            disabled={
              eventType === 'custom' ?
              (titleOfEvent.trim().length === 0 || eventType.length === 0) : // For custom, title and type are required, date is optional
              (eventType.length === 0 || !eventTypeTime) // For non-custom, both type and date are required
            }
            style={[styles.button, {
              // Conditional style to make the button look disabled
              opacity: (eventType === 'custom' ? (titleOfEvent.trim().length === 0 || eventType.length === 0) : (eventType.length === 0 || !eventTypeTime)) ? 0.3 : 1
            }]}
          >
            <Icon name="check" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Confirm</Text>
          </TouchableOpacity>

      </View>
  
      <View style={{marginHorizontal: 20}}>
        <Text style={styles.pickerTitle}>Type of event:</Text>
        <RNPickerSelect
        onValueChange={handleChange}
        items={items}
        placeholder={{ label: "Select type of event", value: null }}
        style={{
          inputIOS: styles.inputIOS,
          inputAndroid: styles.inputAndroid,
          placeholder: {
            color: 'white',
            fontSize: 16,
          },
        }}
      />
        
        {eventType === 'custom' && (
          <View>
            <Text style={styles.pickerTitle}>Title of event:</Text>
            <TextInput
              style={styles.input}
              placeholder="Title of event"
              onChangeText={(text) => setTitleOfEvent(text)}
              value={titleOfEvent}
            />
          </View>
        )}

       <Text style={styles.pickerTitle}>
          {eventType === 'custom' || eventType === 'medication' ? 'Start Date:' : 'Date of Event:'}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleSelectPast} style={styles.eventTypeButton}>
            <Icon name="history" size={24} color={eventTypeTime === 'past' ? primary : 'grey'} />
            <Text style={{ color: eventTypeTime === 'past' ? primary : 'grey' }}>Past</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSelectFuture} style={[styles.eventTypeButton]}>
            <Icon name="event" size={24} color={eventTypeTime === 'future' ? primary : 'grey'} />
            <Text style={{ color: eventTypeTime === 'future' ? primary : 'grey' }}>Future</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop:10 }}>
        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'datetime'}
            is24Hour={true}
            display="default"
            onChange={onChange}
            maximumDate={eventTypeTime === 'future' ? new Date(2300, 10, 20) : new Date()}
            minimumDate={eventTypeTime === 'past' ? new Date(1900, 0, 1) : new Date()}
          />
        )}

        </View>
        {eventTypeTime === 'future' && (
          <View style={{marginTop: 10}}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.pickerTitle}>Set Reminder:</Text>
            <Switch
              value={reminder}
              onValueChange={() => setReminder(!reminder)}
              trackColor={{ false: "gray", true: primary }} // Exemplu de culori pentru starea off și on
              style={{marginBottom:5}}
            />

            </View>
            {reminder && (eventType === 'custom' || eventType === 'medication')  && (
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => setReminderType('once')} style={styles.eventTypeButton}>
            <Icon name="event-available" size={24} color={reminderType === 'once' ? primary : 'grey'} />
            <Text style={{ color: reminderType === 'once' ? primary : 'grey' }}>Once</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setReminderType('cyclically')} style={[styles.eventTypeButton]}>
            <Icon name="repeat" size={24} color={reminderType === 'cyclically' ? primary : 'grey'} />
            <Text style={{ color: reminderType === 'cyclically' ? primary : 'grey' }}>Cyclically</Text>
          </TouchableOpacity>
        </View>

          {reminderType === 'cyclically' && (
           <View>
           {daysOfWeek.map(day => (
             <View key={day.value} style={styles.dayRow}>
               <Text style={styles.dayLabel}>{day.label}</Text>
               <Switch
                 value={!!selectedDays[day.value]}
                 onValueChange={() => toggleDay(day.value)}
                 trackColor={{ false: "gray", true: primary }} // Ensure 'primary' is defined in your styles or directly use a color string here
          
               />
             </View>
           ))}
         </View>
         
          )}
        </View>
      )}
      <Text style={styles.pickerTitle}>Time of the reminder:</Text>
      {reminder && (
        <RNPickerSelect
          onValueChange={(value) => setReminderTime(value)}
          items={[
            { label: 'At the time of event', value: 'onTime' },
            { label: '15 minutes before', value: '15mBefore' },
            { label: '30 minutes before', value: '30mBefore' },
            { label: '1 hour before', value: '1hBefore' },
            { label: '2 hours before', value: '2hBefore' },
            { label: '1 day before', value: '1dBefore' },
          ]}
          placeholder={{}}
          style={{
            inputIOS: styles.inputIOS,
            inputAndroid: styles.inputAndroid,}}
        />
      )}
          </View>
        )}
      <Text style={styles.pickerTitle}>Details:</Text>
      <TextInput
        style={styles.inputDetails}
        placeholder="Add details here..."
        onChangeText={setDetails}
        value={details}
        multiline={true}
      />
    
      </View>
    </ScrollView>
    </KeyboardAvoidingView>

  );
};

export default withDefaultMargins(CreateEvent);
