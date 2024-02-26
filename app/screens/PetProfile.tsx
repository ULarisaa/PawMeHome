// PetProfile.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 


interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  location: { latitude: number; longitude: number }; 
}

// Example pet data
const pet: Pet = {
  id: '1',
  name: 'Buddy',
  imageUrl: 'https://source.unsplash.com/featured/?dog',
  description: 'Buddy is a friendly dog who loves to play fetch and go on long walks.',
  location: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
};

const PetProfile: React.FC = () => {
  // Dummy function for navigation, replace with your navigation logic
  const handleEditPress = () => {
    console.log('Navigate to Edit Screen');
    // navigation.navigate('EditPetScreen', { petId: pet.id }); // Assuming you have set up navigation
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.description}>{pet.description}</Text>
      <Button title="Edit Profile" onPress={handleEditPress} />
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pet.location.latitude,
            longitude: pet.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: pet.location.latitude, longitude: pet.location.longitude }}
            title={`${pet.name}'s Location`}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PetProfile;
