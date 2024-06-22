import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,  KeyboardAvoidingView, ScrollView, Platform, TextInput} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { usePetProfileStyles } from '../../screens/PetProfile/styles';
import { SERVER_URL } from '../../utils/consts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import withDefaultMargins from '../../assets/Margins';
import LoadingScreen from '../Loading/Loading';

const EditSafeZone = () => {
  const [mapRegion, setMapRegion] = useState(null);
  const route = useRoute();
  const [safeZoneVertices, setSafeZoneVertices] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false); 
  const styles = usePetProfileStyles();
  const navigation = useNavigation();
  const { petId,id } = route.params;

  useEffect(() => {
    const fetchSafeZone = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/location/safe_zone/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setSafeZoneVertices([
            { latitude: parseFloat(data.vertex_1_latitude), longitude: parseFloat(data.vertex_1_longitude) },
            { latitude: parseFloat(data.vertex_2_latitude), longitude: parseFloat(data.vertex_2_longitude) },
            { latitude: parseFloat(data.vertex_3_latitude), longitude: parseFloat(data.vertex_3_longitude) },
            { latitude: parseFloat(data.vertex_4_latitude), longitude: parseFloat(data.vertex_4_longitude) }
          ]);
          setMapRegion({
            latitude: parseFloat(data.vertex_1_latitude),
            longitude: parseFloat(data.vertex_1_longitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
          setLoading(false);
        } else {
          console.error('Failed to fetch Safe Zone:', response.statusText);
        }
      } catch (error) {
        console.error('Error while fetching Safe Zone:', error.message);
      }
    };

    fetchSafeZone();
  }, [id]);

  const handleSaveSafeZone = async () => {
    if (dirty) {
      try {
        const response = await fetch(`${SERVER_URL}/location/safe_zone/${id}`, {
          method: 'PUT',
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
          console.log('Safe Zone updated successfully:', data);
          navigation.navigate('Settings', { petId: petId})
        } else {
          console.error('Failed to update Safe Zone:', response.statusText);
        }
      } catch (error) {
        console.error('Error while updating Safe Zone:', error.message);
      }
    }
  };
  

  const handleVertexDrag = (index, e) => {
    const newVertices = [...safeZoneVertices];
    newVertices[index] = e.nativeEvent.coordinate;
    setSafeZoneVertices(newVertices);
    setDirty(true); 
  };

  const handleNameChange = (text) => {
    setName(text);
    setDirty(true); 
  };

  if (loading) {
    return <LoadingScreen />; 
  }

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
            <Text style={styles.createtext}>Edit Safe Zone</Text>
          </View>
  
          <TouchableOpacity
            onPress={handleSaveSafeZone}
            style={[styles.button, { opacity: (name.trim() === '' || !dirty) ? 0.3 : 1 }]}
            disabled={name.trim() === '' || !dirty}
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
            onChangeText={handleNameChange}
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

export default withDefaultMargins(EditSafeZone);
