import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import withDefaultMargins from '../../utils/Margins';
import { usePetProfileStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';

const EditEvent = ({ navigation, route }) => {
  const [eventType, setEventType] = useState('');
  const [titleOfEvent, setTitleOfEvent] = useState('');
  const [date, setDate] = useState(new Date());
  const [reminder, setReminder] = useState(false);
  const [reminderType, setReminderType] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [details, setDetails] = useState('');
  const [initialData, setInitialData] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const styles = usePetProfileStyles();
  const { eventId } = route.params;
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/events/${eventId}`);
        const eventData = await response.json();
        const formattedDate = new Date(eventData.eventdate || new Date());
        setEventType(eventData.typeofevent);
        setTitleOfEvent(eventData.titleofevent || '');
        setDate(formattedDate);
        setReminder(eventData.reminder);
        setReminderType(eventData.reminderType || '');
        setReminderTime(eventData.reminderTime || '');
        setDetails(eventData.details || '');
        setInitialData({
          eventType: eventData.typeofevent,
          titleOfEvent: eventData.titleofevent || '',
          date: formattedDate,
          reminder: eventData.reminder,
          reminderType: eventData.reminderType || '',
          reminderTime: eventData.reminderTime || '',
          details: eventData.details || ''
        });
        setIsDirty(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const checkDirty = () => {
      const isEventDirty = eventType !== initialData.eventType ||
        titleOfEvent !== initialData.titleOfEvent ||
        date.getTime() !== initialData.date.getTime() ||
        reminder !== initialData.reminder ||
        reminderType !== initialData.reminderType ||
        reminderTime !== initialData.reminderTime ||
        details !== initialData.details;
      setIsDirty(isEventDirty);
    };

    checkDirty();
  }, [eventType, titleOfEvent, date, reminder, reminderType, reminderTime, details]);

  const handleSaveEvent = async () => {
    if (isDirty) {
      console.log('Saving changes...');
      // Implement saving logic here
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
            <Icon name="arrow-back" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Back</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.createtext}>Edit Event</Text>
          </View>

          <TouchableOpacity
              onPress={handleSaveEvent}
              disabled={!isDirty}
              style={[styles.button, { opacity: !isDirty ? 0.3 : 1 }]}
            >
              <Icon name="check" size={24} color={styles.createEventButton.color} />
              <Text style={styles.createEventButton}>Confirm</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: 20 }}>
  <Text style={styles.pickerTitle}>Type of event:</Text>
  <RNPickerSelect
    onValueChange={setEventType}
    items={[
      { label: "Meeting", value: "meeting" },
      { label: "Appointment", value: "appointment" },
      { label: "Medication", value: "medication" },
      { label: "Custom", value: "custom" },  // Assuming custom type allows for more detailed event creation
      // Add more event types as needed
    ]}
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
        onChangeText={setTitleOfEvent}
        value={titleOfEvent}
      />
    </View>
  )}

  <Text style={styles.pickerTitle}>{eventType === 'custom' ? 'Start Date:' : 'Date of Event:'}</Text>
  <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerButton}>
    <Icon name="calendar-today" size={24} />
    <Text>{date.toDateString()}</Text>
  </TouchableOpacity>
  {showPicker && (
    <DateTimePicker
      testID="dateTimePicker"
      value={date}
      mode="date"
      is24Hour={true}
      display="default"
      onChange={(event, selectedDate) => {
        setDate(selectedDate || date);
        setShowPicker(Platform.OS === 'ios');
      }}
    />
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

export default withDefaultMargins(EditEvent);
