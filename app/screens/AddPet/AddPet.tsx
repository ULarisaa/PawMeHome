import React, { useState } from 'react';
import { View, Text, Button, Alert, Image, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadModal from '../../utils/functions/UploadModal';
import { usePetsStyles } from './styles'; // Asigură-te că calea este corectă
import { Colors, primary } from '../../utils/colors';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import withDefaultMargins from '../../utils/Margins';
import { SERVER_URL } from '../../utils/consts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const AddPet = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const styles = usePetsStyles();
  const scheme = useColorScheme();
  const [sex, setSex] = useState(''); 
  const [breed, setBreed] = useState('');
  const navigation=useNavigation();
  
  const uploadImageAsync = async (uri: string) => {
    const formData = new FormData();
    formData.append('image', { uri: uri, name: 'upload.jpg', type: 'image/jpeg' });

    

    const response = await fetch(`${SERVER_URL}/pets/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  };


  const handleSubmit = async () => {
    if (!name || !imageUrl) { // Removed the check for age since it's not used
        Alert.alert("Error", "Please fill all the fields and select an image.");
        return;
    }

    setIsLoading(true);
    try {
        const imageUrlResult = await uploadImageAsync(imageUrl);
        
        // Formatting birthDate to a string that can be easily processed by your server
        // Assuming your server accepts dates in 'YYYY-MM-DD' format
        const birthDateString = birthdate.toISOString().split('T')[0];
        
        const petData = { name, birthdate: birthDateString, imageUrl: imageUrlResult, breed, sex };

        const response = await fetch(`${SERVER_URL}/pets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(petData),
        });

        if (!response.ok) {
            throw new Error('Failed to add pet');
        }

        Alert.alert("Success", "Pet added successfully!");
        resetForm();
    } catch (error) {
        console.error("Error: ", error);
        Alert.alert("Error", "There was an error adding your pet.");
    } finally {
        setIsLoading(false);
    }
};

const resetForm = () => {
    setName('');
    setImageUrl(null);
    setBirthDate(new Date()); // Reset the birthDate as well
};


  const handleDeleteImage = () => {
    setImageUrl(null); // Remove the imageUri
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setBirthDate(currentDate);
  };

  return (
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView>
          <View style={styles.buttonsRow}>
            <TouchableOpacity  style={[styles.button]}>
              <Icon name="arrow-back" size={24} color={styles.textinvisible.color} />
              <Text style={styles.textinvisible}>Back</Text>
            </TouchableOpacity>

            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.createText}>Add New Pet</Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!name || !sex || !birthdate}
              style={[styles.button, {
                opacity: (!name || !sex || !birthdate) ? 0.3 : 1
              }]}
            >
              <Icon name="check" size={24} color={primary} />
              <Text style={styles.createEventButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
      
    <View style={{marginHorizontal: 20}}>
      <Text style={styles.label}>Name of the pet:</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      
      <Text style={styles.label}>Birthdate:</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <DateTimePicker
          testID="dateTimePicker"
          value={birthdate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      </View>

      <Text style={styles.label}>Breed:</Text>
          <TextInput
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
            style={styles.input}
          />

          <Text style={styles.label}>Sex:</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setSex('male')}>
              <MaterialIcons name="male" size={48} color={sex === 'male' ? Colors[scheme].primary : Colors[scheme].text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSex('female')}>
              <MaterialIcons name="female" size={48} color={sex === 'female' ? Colors[scheme].primary : Colors[scheme].text} />
            </TouchableOpacity>
          </View>

   
      {!imageUrl && (
        <View>
          <Text style={styles.label}>Select a profile image:</Text>
          <Button title="Select Image" color={primary} onPress={() => setModalVisible(true)} />
        </View>
      )}
      
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TouchableOpacity
            style={[styles.icon, styles.editIcon]}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={24} color={Colors[scheme].text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icon, styles.deleteIcon]}
            onPress={handleDeleteImage}
          >
            <MaterialIcons name="delete" size={24} color={Colors[scheme].text} />
          </TouchableOpacity>
        </View>
      )}
      
  
      <UploadModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={(url: string | null) => {
          setImageUrl(url);
          setModalVisible(false);
        }}
      />
      </View>
    </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default withDefaultMargins(AddPet);