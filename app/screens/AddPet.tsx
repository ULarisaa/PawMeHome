import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import UploadModal from '../components/UploadModal';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddPet: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const firestore = getFirestore();
  const storage = getStorage();

  const uploadImageAsync = async (uri) => {
    const imageName = `pets/${new Date().getTime()}-${uri.split('/').pop()}`;
    const storageRef = ref(storage, imageName);

    const response = await fetch(uri);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image for the pet.");
      return;
    }
    try {
      const imageUrl = await uploadImageAsync(imageUri);
      const docRef = await addDoc(collection(firestore, "pets"), {
        name,
        age,
        imageUrl,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Pet Added", "Your pet has been added successfully!");
      setName('');
      setAge('');
      setImageUri(null);
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "There was an error adding your pet.");
    }
  };

  const handleDeleteImage = () => {
    setImageUri(null); // Remove the imageUri
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Pet</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
        style={styles.input}
      />
      {!imageUri && (
        <Button title="Select Image" onPress={() => setModalVisible(true)} />
      )}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity
            style={[styles.icon, styles.editIcon]}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icon, styles.deleteIcon]}
            onPress={handleDeleteImage}
          >
            <MaterialIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <Button title="Add Pet" onPress={handleSubmit} />
      <UploadModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={(uri: string | null) => {
          console.log('Selected image URI: ', uri);
          setImageUri(uri);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 100,
  },
  icon: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  editIcon: {
    right: 10,
    bottom: 10,
  },
  deleteIcon: {
    right: 10,
    top: 10,
  },
});

export default AddPet;
