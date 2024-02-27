import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, Alert, Linking } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { doc, getDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

import { FIRESTORE_DB } from '../../FirebaseConfig';
import { useRoute } from '@react-navigation/native';
import { calculateDistance } from '../utils/functions/CalculateDistance'; // Make sure the path matches your project structure
import LoadingScreen from './LoadingScreen';

interface Pet {
  id: string;
  name: string;
  imageUrl: string;
  age: number;
  location?: { latitude: number; longitude: number };
}

const PetProfile: React.FC = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const route = useRoute();
  const { petId } = route.params;
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [distanceToPet, setDistanceToPet] = useState<number | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      const petRef = doc(FIRESTORE_DB, 'pets', petId);
      const petDoc = await getDoc(petRef);

      if (petDoc.exists()) {
        const petData = petDoc.data();
        setPet({
          id: petDoc.id,
          name: petData.name,
          imageUrl: petData.imageUrl,
          age: petData.age,
          location: {
            latitude: 	45.760696,
            longitude: 21.226788,
          },
        });
        
      } else {
        console.log('No such document!');
      }
    };

    if (petId) {
      fetchPet();
    }
  }, [petId]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status:", status); // Log permission status
  
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'This app requires location permissions to function. Please enable them in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      console.log("User location:", location.coords);
  
      // Set the userLocation state here
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  
      if (pet?.location) {
        console.log("Pet location:", pet.location); // Ensure this is logged and has valid latitude and longitude
        const distance = calculateDistance(location.coords.latitude, location.coords.longitude, pet.location.latitude, pet.location.longitude);
        console.log("Distance to pet:", distance); // Confirm this logs a sensible distance value
        setDistanceToPet(distance);
      }
    })();
  }, [pet]);
  


if (!pet || distanceToPet === null) {
  return <LoadingScreen />;
}


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pet.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.description}>{`${pet.age} years old - ${distanceToPet.toFixed(2)} km away`}</Text>
      {pet.location && (
        <View style={styles.mapContainer}>
         <MapView
        style={styles.map}
        initialRegion={{
          latitude: (userLocation.latitude + pet.location.latitude) / 2,
          longitude: (userLocation.longitude + pet.location.longitude) / 2,
          latitudeDelta: Math.abs(userLocation.latitude - pet.location.latitude) + 0.1, // Adjust delta values as needed
          longitudeDelta: Math.abs(userLocation.longitude - pet.location.longitude) + 0.1,
        }}
      >
        <Marker
          coordinate={{ latitude: pet.location.latitude, longitude: pet.location.longitude }}
          title={`${pet.name}'s Location`}
        />
         <Marker
      coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
      title="Your Location"
      pinColor="blue" // Optional: This changes the pin color for distinction
    />
        <Polyline
          coordinates={[
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: pet.location.latitude, longitude: pet.location.longitude },
          ]}
          strokeColor="#FF0000" // Example: Red
          geodesic={true}
          strokeWidth={2}
        />
      </MapView>

        </View>
      )}
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
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PetProfile;
