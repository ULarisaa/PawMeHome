import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';
import { calculateDistance } from '../utils/functions/CalculateDistance';
import { usePetProfileStyles } from '../screens/PetProfile/styles';
import { SERVER_URL } from '../utils/consts';
import * as Location from 'expo-location';
import { useAuth } from '../utils/functions/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const LocationComponent = ({ pet, loadingMap, navigation }) => {
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0, speed: 0 });
  const [petLocation, setPetLocation] = useState({ latitude: 0, longitude: 0 });
  const [distanceToPet, setDistanceToPet] = useState(null);
  const [safeZones, setSafeZones] = useState([]);
  const [inSafeZone, setInSafeZone] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [units, setUnits] = useState('metric');
  const { currentUser, loading, setLoading } = useAuth();
  const styles = usePetProfileStyles();

  const fetchUnits = useCallback(async (userId) => {
    try {
      const response = await fetch(`${SERVER_URL}/app/app-settings/${userId}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Failed to fetch units, status code: ${response.status}`);
      }
      const data = await response.json();
      setUnits(data.units);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
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
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed || 0
        });
        setMapReady(true);

        const fetchUserIdAndUnits = async () => {
          setLoading(true);
          try {
            const responseToken = await fetch(`${SERVER_URL}/users/decodeToken`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: currentUser.token }),
            });

            if (!responseToken.ok) {
              throw new Error('Failed to decode token');
            }

            const { userId } = await responseToken.json();
            await fetchUnits(userId); 
          } catch (error) {
            console.error('Error fetching user ID and units:', error);
          } finally {
            setLoading(false);
          }
        };
        const fetchLocationAndSafetyStatus = async () => {
          try {
            console.log(`Fetching data for pet ID: ${pet.id}`);
            const response = await fetch(`${SERVER_URL}/location/${pet.id}`, { method: 'GET' });
          
            const data = await response.json();
            console.log('Received data:', data);
          
            if (
              data &&
              typeof data.latitude === 'string' &&
              typeof data.longitude === 'string' &&
              typeof data.in_safe_zone === 'boolean' &&
              parseFloat(data.latitude) >= -90 &&
              parseFloat(data.latitude) <= 90 &&
              parseFloat(data.longitude) >= -180 &&
              parseFloat(data.longitude) <= 180
            ) {
              setPetLocation({ latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) });
              setInSafeZone(data.in_safe_zone);
            } else {
         
              Alert.alert(
                'Location data not available',
                'Please check if the device is connected.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }
          } catch (error) {
  
          }
        };
        
        

        const fetchSafeZones = async () => {
          try {
            const response = await fetch(`${SERVER_URL}/location/pet/${pet.id}`, { method: 'GET' });
            if (!response.ok) {
              throw new Error(`Failed to fetch safe zones, status code: ${response.status}`);
            }

            const data = await response.json();
            setSafeZones(data);
          } catch (error) {
            console.error('Error fetching safe zones:', error);
          }
        };

        await fetchUserIdAndUnits();
        fetchLocationAndSafetyStatus();
        fetchSafeZones();

        return () => {
   
        };
      };

      fetchData();

      const interval = setInterval(() => {
        fetchData();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }, [pet.id, currentUser.token, fetchUnits, setLoading])
  );

  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude && petLocation.latitude && petLocation.longitude) {
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, petLocation.latitude, petLocation.longitude);
      setDistanceToPet(distance);
    }
  }, [userLocation, petLocation]);
  

 
  
  const formatDistance = (distance) => {
    if (units === 'imperial') {
      const distanceInMiles = distance * 0.621371; 
      if (distanceInMiles < 1) {
        return `${Math.round(distanceInMiles * 5280)} feet`;
      } else {
        return `${distanceInMiles.toFixed(2)} miles`;
      }
    } else {
      if (distance < 1) {
        return `${Math.round(distance * 1000)} meters`;
      } else {
        return `${distance.toFixed(2)} km`;
      }
    }
  };

  const calculateEstimatedTime = (distanceInKm, userSpeed, petSpeed) => {
    const averageUserSpeed = userSpeed > 0 ? userSpeed : 5; 
    const averagePetSpeed = petSpeed > 0 ? petSpeed : 3; 

    const timeToReach = distanceInKm / (averageUserSpeed + averagePetSpeed);
    const hours = Math.floor(timeToReach);
    const minutes = Math.round((timeToReach - hours) * 60);
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
  };
  
  const userSpeed = userLocation.speed; 
  const petSpeed = 0; 
  const distanceInKm = distanceToPet;
  const estimatedTimeText = calculateEstimatedTime(distanceInKm, userSpeed, petSpeed);

  return (
    <View style={{ flex: 1 }}>
      {mapReady ? (
        <View style={{ flex: 1 }}>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
            >
              <Marker
                coordinate={{ latitude: petLocation.latitude, longitude: petLocation.longitude }}
                title="Pet's Location"
              />
              <Marker
                coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                title="Your Location"
                pinColor="blue"
              />
              <Polyline
                coordinates={[
                  { latitude: userLocation.latitude, longitude: userLocation.longitude },
                  { latitude: petLocation.latitude, longitude: petLocation.longitude },
                ]}
                strokeColor="#FF0000"
                geodesic={true}
                strokeWidth={2}
              />
              {safeZones.map(zone => (
                <Polygon
                  key={zone.id}
                  coordinates={[
                    { latitude: parseFloat(zone.vertex_1_latitude), longitude: parseFloat(zone.vertex_1_longitude) },
                    { latitude: parseFloat(zone.vertex_2_latitude), longitude: parseFloat(zone.vertex_2_longitude) },
                    { latitude: parseFloat(zone.vertex_3_latitude), longitude: parseFloat(zone.vertex_3_longitude) },
                    { latitude: parseFloat(zone.vertex_4_latitude), longitude: parseFloat(zone.vertex_4_longitude) },
                  ]}
                  strokeWidth={2}
                  strokeColor="#00FF00"
                  fillColor="rgba(0, 255, 0, 0.2)"
                />
              ))}
            </MapView>
          </View>
          <View style={styles.infoContainer}>
            {distanceToPet !== null && (
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>Distance to pet:</Text>
                <Text style={styles.distanceText}>{formatDistance(distanceToPet)}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>Estimated time to reach {pet.name}:</Text>
              <Text style={styles.distanceText}>{estimatedTimeText}</Text>
            </View>
            {safeZones.length > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoText}>Safety status:</Text>
                {inSafeZone ? (
                  <Text style={[styles.distanceText, styles.safeText]}>The pet is in a safe zone</Text>
                ) : (
                  <Text style={[styles.distanceText, styles.notSafeText]}>The pet is NOT in a safe zone</Text>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      )}
    </View>
  );
};

export default LocationComponent;
