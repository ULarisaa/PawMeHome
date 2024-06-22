import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { getCurrentPositionAsync } from 'expo-location';
import { usePetProfileStyles } from '../../screens/PetProfile/styles';
import { SERVER_URL } from '../../utils/consts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import withDefaultMargins from '../../assets/Margins';

const CreateSafeZone  = () => {
  const [mapRegion, setMapRegion] = useState(null);
  const route = useRoute();
  const [safeZoneVertices, setSafeZoneVertices] = useState([]);
  const [name, setName] = useState('');
  const styles = usePetProfileStyles();
  const navigation = useNavigation();
  const { petId } = route.params;

  useEffect(() => {
    const getLocationAsync = async () => {
      const location = await getCurrentPositionAsync({ accuracy: 6 });
      const { latitude, longitude } = location.coords;

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      const size = 0.001;
      setSafeZoneVertices([
        { latitude: latitude + size, longitude: longitude - size },
        { latitude: latitude + size, longitude: longitude + size },
        { latitude: latitude - size, longitude: longitude + size },
        { latitude: latitude - size, longitude: longitude - size },
      ]);
    };

    getLocationAsync();
  }, []);

  const handleSaveSafeZone = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/location/safe_zone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          petId: petId,
          vertices: {
            vertex1: safeZoneVertices[0],
            vertex2: safeZoneVertices[1],
            vertex3: safeZoneVertices[2],
            vertex4: safeZoneVertices[3],
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Safe Zone created successfully:', data);
        navigation.goBack(); 
      } else {
        console.error('Failed to create Safe Zone:', response.statusText);
      }
    } catch (error) {
      console.error('Error while saving Safe Zone:', error.message);
    }
  };

  const handleVertexDrag = (index, e) => {
    const newVertices = [...safeZoneVertices];
    newVertices[index] = e.nativeEvent.coordinate;
    setSafeZoneVertices(newVertices);
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
            <Text style={styles.createtext}>Create Safe Zone</Text>
          </View>
  
          <TouchableOpacity
                onPress={handleSaveSafeZone}
                style={[styles.button, { opacity: name.trim() === '' ? 0.3 : 1 }]}
                disabled={name.trim() === ''}
                >
                <Icon name="check" size={24} color={styles.createEventButton.color} />
                <Text style={styles.createEventButton}>Confirm</Text>
                </TouchableOpacity>

        </View>
        
        <View style={{ marginHorizontal: 20 }}>
          <Text style={styles.pickerTitle}>Name of the safe zone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name of the safe zone"
            onChangeText={setName}
            value={name}
          />
        </View>
        {mapRegion && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
            >
              <Polygon
                coordinates={safeZoneVertices}
                fillColor="rgba(100, 200, 255, 0.5)"
                strokeColor="rgba(100, 200, 255, 1)"
                strokeWidth={1}
              />
              {safeZoneVertices.map((vertex, index) => (
                <Marker
                  key={index}
                  coordinate={vertex}
                  draggable
                  onDragEnd={(e) => handleVertexDrag(index, e)}
                />
              ))}
            </MapView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withDefaultMargins(CreateSafeZone);
