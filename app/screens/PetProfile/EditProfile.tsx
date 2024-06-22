import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Image, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadModal from '../../components/UploadModal';
import { usePetsStyles } from '../AddPet/styles';
import { Colors, primary } from '../../assets/colors';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import withDefaultMargins from '../../assets/Margins';
import { SERVER_URL } from '../../utils/consts';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditPet = ({ route }) => {
  const { petId } = route.params;
  const [isDirty, setIsDirty] = useState(false);
  const [name, setName] = useState('');
  const [birthdate, setBirthDate] = useState(new Date());
  const [imageUrl, setImageUrl] = useState(null);
  const [sex, setSex] = useState('');
  const [breed, setBreed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const styles = usePetsStyles();
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const checkIfDirty = (newValue, fieldName) => {
    if (!initialData) return; 
    const isDirty = Object.entries(initialData).some(([key, value]) => {
      if (key === fieldName) {
        return newValue.toString() !== value.toString();
      }
      return false;
    });
    setIsDirty(isDirty);
  };

  const handleNameChange = (newName) => {
    setName(newName);
    checkIfDirty(newName, 'name');
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setBirthDate(currentDate);
    checkIfDirty(currentDate, 'birthdate');
  };

  const handleSexChange = (newSex) => {
    setSex(newSex);
    checkIfDirty(newSex, 'sex');
  };

  const handleBreedChange = (newBreed) => {
    setBreed(newBreed);
    checkIfDirty(newBreed, 'breed');
  };

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/pets/${petId}`);
        const data = await response.json();

        setName(data.name);
        setBirthDate(new Date(data.birthdate));
        setImageUrl(data.imageurl);
        setSex(data.sex);
        setBreed(data.breed);
        setInitialData(data); 
        setIsDirty(false); 
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [petId]);

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!name || !birthdate || !sex || !breed || !imageUrl) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedPet = { name, birthdate: birthdate.toISOString(), imageUrl, sex, breed };
      const response = await fetch(`${SERVER_URL}/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPet),
      });

      if (!response.ok) throw new Error('Failed to update pet');
      Alert.alert("Success", "Pet updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate('DashboardScreen'), 
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "There was an error updating the pet.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
    checkIfDirty(newImageUrl, 'imageUrl');
  };
  
  const handleDeleteImage = () => {
    setImageUrl(null);
    checkIfDirty(null, 'imageUrl');
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
         <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
           <Icon name="arrow-back" size={24} color={primary} />
           <Text style={styles.createEventButton}>Back</Text>
         </TouchableOpacity>

         <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
           <Text style={styles.createText}>Edit Pet</Text>
         </View>

         <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isDirty || !name || !sex || !birthdate}
            style={[styles.button, {
               
                opacity: (!isDirty || !name || !sex || !birthdate) ? 0.3 : 1
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
     onChangeText={handleNameChange}
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
         onChangeText={handleBreedChange}
         style={styles.input}
       />

       <Text style={styles.label}>Sex:</Text>
       <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => handleSexChange('male')}>
                <MaterialIcons name="male" size={48} color={sex === 'male' ? Colors[scheme].primary : Colors[scheme].text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSexChange('female')}>
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
     onImageSelect={(imageUrl) => {
        handleImageChange(imageUrl);
        setModalVisible(false); 
      }}
   />
   </View>
 </ScrollView>
   </KeyboardAvoidingView>
 </TouchableWithoutFeedback>
);
};
export default withDefaultMargins(EditPet);
