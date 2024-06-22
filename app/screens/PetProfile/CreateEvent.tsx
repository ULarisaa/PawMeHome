import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch, Platform, KeyboardAvoidingView, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import withDefaultMargins from '../../assets/Margins';
import { usePetProfileStyles } from './styles';
import { primary } from '../../assets/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { SERVER_URL } from '../../utils/consts';
import { useAuth } from '../../utils/functions/AuthContext';
import { useNotificationToken } from '../../utils/functions/NotificationTokenContext';
import * as DocumentPicker from 'expo-document-picker';
import UploadModal from '../../components/UploadModal';

const CreateEvent = () => {
  const { currentUser } = useAuth();
  const { expoPushToken } = useNotificationToken();
  console.log('token', expoPushToken);
  const [eventType, setEventType] = useState('');
  const [eventLabel, setEventLabel] = useState('');
  const [titleOfEvent, setTitleOfEvent] = useState('');
  const [eventTypeTime, setEventTypeTime] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('onTime');
  const [reminderType, setReminderType] = useState('once');
  const [details, setDetails] = useState('');
  const [selectedDays, setSelectedDays] = useState({});
  const [endDate, setEndDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser && currentUser.token) {
      console.log("Logged in with token:", currentUser.token);
    }
  }, [currentUser]);


const handleImageSelect = (imageUri: string | null) => {
  if (imageUri) {
    setSelectedImages(prevImages => [...prevImages, imageUri]);
  }
  setIsModalVisible(false);
};

const handleImageDelete = (index: number) => {
  setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
};
const handleFileDelete = (index) => {
  const newSelectedFiles = [...selectedFiles];
  newSelectedFiles.splice(index, 1);
  setSelectedFiles(newSelectedFiles);
};





  const route = useRoute();
  const items = [
    { label: "Doctor's Appointment", value: 'doctor' },
    { label: 'Vaccination', value: 'vaccination' },
    { label: 'Medication', value: 'medication' },
    { label: 'Custom', value: 'custom' },
  ];

  const formatDateAndTime = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

  const createEvent = async () => {
    try {
        console.log(selectedImages);
        
   
        const formattedEventDate = date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });


        const eventBody = {
            petid: petId,
            eventType: eventType,
            titleofevent: eventType !== 'custom' ? eventType : titleOfEvent || '',
            eventdate: formattedEventDate,
            details: details,
            files: selectedFiles.map(file => ({ uri: file.uri, name: file.name })),
            images: selectedImages.map(uri => ({ uri })),
        };


        const response = await fetch(`${SERVER_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventBody),
        });

  
        if (response.ok) {
            const result = await response.json();
            
    
            if (reminder) {
                try {
  
                    const formattedDate = formatDateAndTime(new Date(date));
                    
      
                    const notificationData = {
                        pet_id: petId,
                        user_token: expoPushToken,
                        message: `${eventLabel} on ${formattedDate}`,
                        type: 'reminder',
                        remindertime: reminderTime,
                        details: details,
                        reminder: reminder,
                        reminder_type: reminderType,
                        selectedDays: Object.keys(selectedDays).filter(day => selectedDays[day]),
                        start_date: formattedDate,
                        event_id: result.eventid,
                        end_date: formatDateAndTime(new Date(endDate))
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

   
            navigation.goBack();
            Alert.alert("Success", "Event created successfully");
        } else {
            throw new Error('Failed to create event');
        }
    } catch (error) {
        console.error('Request failed:', error);
        Alert.alert("Error", "Failed to create event: " + (error.message || error));
    }
};

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
    const item = items.find(item => item.value === value);
    setEventType(value);
    if (item) {
      setEventLabel(item.label);
    } else {
      setEventLabel('');
    }
  };

  const { petId } = route.params;
  console.log(petId);

  const styles = usePetProfileStyles();
  const navigation = useNavigation();
 
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setEndDate(currentDate);
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
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"]
      });
  
      if (!result.canceled && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFiles(prevFiles => [...prevFiles, { uri: file.uri, name: file.name }]);
        Alert.alert("Success", "File picked successfully!");
      } else {
        console.log('File pick cancelled');
        Alert.alert("Cancelled", "File selection was cancelled.");
      }
    } catch (err) {
      console.error('Error picking file:', err);
      Alert.alert("Error", "An error occurred while picking the file.");
    }
  };
  
  
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
            <Icon name="arrow-back" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Back</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.createText}>Create Event</Text>
          </View>

          <TouchableOpacity
            onPress={createEvent}
            disabled={
              eventType === 'custom' ?
                (titleOfEvent.trim().length === 0 || eventType.length === 0) :
                (eventType.length === 0 || !eventTypeTime)
            }
            style={[styles.button, {
              opacity: (eventType === 'custom' ? (titleOfEvent.trim().length === 0 || eventType.length === 0) : (eventType.length === 0 || !eventTypeTime)) ? 0.3 : 1
            }]}
          >
            <Icon name="check" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {/* Body Section */}
        <View style={{ marginHorizontal: 20 }}>
          {/* Type of Event */}
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

          {/* Date of Event */}
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
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
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
          
          {/* Reminder Section */}
          {eventTypeTime === 'future' && (
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.pickerTitle}>Set Reminder:</Text>
                <Switch
                  value={reminder}
                  onValueChange={() => setReminder(!reminder)}
                  trackColor={{ false: "gray", true: primary }}
                  style={{ marginBottom: 5 }}
                />
              </View>
              {reminder && (eventType === 'custom' || eventType === 'medication') && (
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
                            trackColor={{ false: "gray", true: primary }}
                          />
                        </View>
                      ))}

                      <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text style={styles.pickerTitle}>End of Notification Period:</Text>
                      </TouchableOpacity>
                      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        {showPicker && (
                          <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={handleEndDateChange}
                            minimumDate={new Date()}
                          />
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Reminder Time */}
          {reminder && (
            <View>
              <Text style={styles.pickerTitle}>Time of the reminder:</Text>
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
                  inputAndroid: styles.inputAndroid,
                }}
              />
            </View>
          )}

          {/* Details Section */}
          <Text style={styles.pickerTitle}>Details:</Text>
          <TextInput
            style={styles.inputDetails}
            placeholder="Add details here..."
            onChangeText={setDetails}
            value={details}
            multiline={true}
          />

    
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
  <TouchableOpacity onPress={handleFilePick} style={styles.eventTypeButton}>
    <Icon name="attach-file" size={24} color={styles.createEventButton.color} />
    <Text style={styles.attachButton}>Attach PDF File</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.eventTypeButton}>
    <Icon name="image" size={24} color={styles.createEventButton.color} />
    <Text style={styles.attachButton}>Attach Images</Text>
  </TouchableOpacity>
</View>

{selectedFiles.length > 0 && (
  <View>
    <Text style={styles.pickerTitle}>Selected Files:</Text>
    {selectedFiles.map((file, index) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Icon name="attach-file" size={24} color={styles.createEventButton.color} />
        <Text style={{ marginLeft: 10, marginRight:10, color: primary }}>{file.name}</Text>
        <TouchableOpacity onPress={() => handleFileDelete(index)}>
          <Icon name="delete" size={24} color={styles.createEventButton.color} />
        </TouchableOpacity>
      </View>
    ))}
  </View>
)}


{selectedImages.length > 0 && (
  <View>
    <Text style={styles.pickerTitle}>Selected Images:</Text>
    {selectedImages.map((imageUri, index) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
        <TouchableOpacity onPress={() => handleImageDelete(index)}>
          <Icon name="delete" size={24} color={styles.createEventButton.color} />
        </TouchableOpacity>
      </View>
    ))}
  </View>
)}

      
          <UploadModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} onImageSelect={handleImageSelect} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withDefaultMargins(CreateEvent);

