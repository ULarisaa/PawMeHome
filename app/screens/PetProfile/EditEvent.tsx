import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import UploadModal from '../../components/UploadModal';
import { usePetProfileStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';
import { useAuth } from '../../utils/functions/AuthContext';
import withDefaultMargins from '../../assets/Margins';
import { primary } from '../../assets/colors';

const EditEvent = ({ route }) => {
  const { eventId } = route.params;
  const { currentUser } = useAuth();
  const [initialEventInfo, setInitialEventInfo] = useState(null); 
  const [titleOfEvent, setTitleOfEvent] = useState('');
  const [details, setDetails] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventType, setEventType] = useState('');
  const [confirmEnabled, setConfirmEnabled] = useState(false); 
  const styles = usePetProfileStyles();
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser && currentUser.token) {
      console.log("Logged in with token:", currentUser.token);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/events/${eventId}/details`);
        if (response.ok) {
          const eventData = await response.json();
          console.log('Fetched event data:', eventData);
          setInitialEventInfo(eventData); 
          const { eventDetails, eventFiles, eventImages } = eventData;
          console.log(eventData);
          setEventType(eventDetails.typeofevent);
          if (eventDetails.typeofevent === 'custom') {
            setTitleOfEvent(eventDetails.titleofevent || '');
          }
          setDetails(eventDetails.details || '');
          setSelectedFiles(eventFiles || []);
          setSelectedImages(eventImages.map(image => image.image_uri) || []);
        } else {
          throw new Error('Failed to fetch event data');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        Alert.alert("Error", "Failed to fetch event data");
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {

    if (initialEventInfo) {
      const hasChanges =
        initialEventInfo.titleOfEvent !== titleOfEvent ||
        initialEventInfo.details !== details ||
        JSON.stringify(initialEventInfo.selectedImages) !== JSON.stringify(selectedImages) ||
        JSON.stringify(initialEventInfo.selectedFiles) !== JSON.stringify(selectedFiles);

      setConfirmEnabled(hasChanges);
    }
  }, [initialEventInfo, titleOfEvent, details, selectedImages, selectedFiles]);

  const editEvent = async () => {
    try {
      const eventBody = {
        details: details,
        files: selectedFiles,
        images: selectedImages.map(uri => ({ uri })),
      };

      if (eventType === 'custom') {
        eventBody.titleofevent = titleOfEvent;
      }

      const response = await fetch(`${SERVER_URL}/events/${eventId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      });

      if (response.ok) {
        navigation.goBack();
        Alert.alert("Success", "Event updated successfully");
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Request failed:', error);
      Alert.alert("Error", "Failed to update event: " + (error.message || error));
    }
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

  const handleImageSelect = (imageUri) => {
    if (imageUri) {
      setSelectedImages(prevImages => [...prevImages, imageUri]);
      setIsModalVisible(false);
    }
  };

  const handleImageDelete = (index) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleFileDelete = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
            <Icon name="arrow-back" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Back</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.createText}>Edit Event</Text>
          </View>

          <TouchableOpacity
            onPress={editEvent}
            disabled={eventType === 'custom' && titleOfEvent.trim().length === 0}
            style={[styles.button, { opacity: eventType === 'custom' && titleOfEvent.trim().length === 0 ? 0.3 : 1 }]}
          >
            <Icon name="check" size={24} color={styles.createEventButton.color} />
            <Text style={styles.createEventButton}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {/* Body Section */}
        <View style={{ marginHorizontal: 20 }}>
          {/* Title of Event */}
          {eventType === 'custom' && (
            <>
              <Text style={styles.pickerTitle}>Title of event:</Text>
              <TextInput
                style={styles.input}
                placeholder="Title of event"
                onChangeText={setTitleOfEvent}
                value={titleOfEvent}
              />
            </>
          )}

          {/* Details */}
          <Text style={styles.pickerTitle}>Details:</Text>
          <TextInput
            style={styles.inputDetails}
            placeholder="Add details here..."
            onChangeText={setDetails}
            value={details}
            multiline={true}
          />

          {/* Attachments */}
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

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <View>
              <Text style={styles.pickerTitle}>Selected Files:</Text>
              {selectedFiles.map((file, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Icon name="attach-file" size={24} color={styles.createEventButton.color} />
                  <Text style={{ marginLeft: 10, marginRight: 10, color: primary }}>{file.name}</Text>
                  <TouchableOpacity onPress={() => handleFileDelete(index)}>
                    <Icon name="delete" size={24} color={styles.createEventButton.color} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Selected Images */}
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

          {/* Upload Modal */}
          <UploadModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} onImageSelect={handleImageSelect} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withDefaultMargins(EditEvent);

