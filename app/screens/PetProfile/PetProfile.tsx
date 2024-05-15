import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, Alert, Linking, TouchableOpacity, FlatList, SectionList, TextInput } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import withDefaultMargins from '../../utils/Margins';
import { useNavigation, useRoute } from '@react-navigation/native';
import { calculateDistance } from '../../utils/functions/CalculateDistance';
import LoadingScreen from '../../utils/functions/Loading/Loading';
import { SERVER_URL } from '../../utils/consts';
import { usePetProfileStyles } from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from 'react-native-vector-icons';
import { primary } from '../../utils/colors';
import EventCalendar from '../../components/Calendar';
import EventCalendarWithTimeline from '../../components/Calendar';



const PetProfile = () => {
  const [pet, setPet] = useState(null);
  const navigation = useNavigation();
    const route = useRoute();
    const { petId } = route.params;
    const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
    const [distanceToPet, setDistanceToPet] = useState(null);
    const [activeSection, setActiveSection] = useState('history');
    const styles = usePetProfileStyles();
    const [loadingMap, setLoadingMap] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const isSelected = (section) => activeSection === section;

    const [events, setEvents] = useState([]);
    

    const handleSearch = (text) => {
      setSearchQuery(text.toLowerCase());
    };

    const fetchEventsForPet = async (petId) => {
      try {
          const response = await fetch(`${SERVER_URL}/events/pets/${petId}`);
          const { allEvents } = await response.json(); // Extrage allEvents din răspuns
    
          setEvents(allEvents); // Actualizează starea cu toate evenimentele
      } catch (err) {
          console.error('Error fetching events:', err); // Loghează orice eroare
      }
    };
    
  // Folosește efectul pentru a încărca evenimentele când componenta este montată sau când petId se schimbă
  useEffect(() => {
    if (petId) { // Verifică dacă petId este definit
        fetchEventsForPet(petId);
    }
}, []); // Adaugă petId în lista de dependințe

    useEffect(() => {
      const fetchPet = async () => {
        setLoadingMap(true);
        try {
          const response = await fetch(`${SERVER_URL}/pets/${petId}`);
          if (!response.ok) {
            throw new Error('Pet not found');
          }
          const petData = await response.json();
          setPet({
            id: petData.id,
            name: petData.name,
            imageUrl: petData.imageurl,
            birthdate: petData.birthdate,
            latitude: parseFloat(petData.latitude),
            longitude: parseFloat(petData.longitude),
            breed: petData.breed,
            sex:petData.sex
          });
        } catch (error) {
          console.error('Failed to fetch pet:', error);
        }
      finally {
        // Se execută indiferent de rezultatul try/catch
        setLoadingMap(false); // Sfârșește încărcarea dacă a eșuat preluarea datelor animalului de companie
      }
      };
    
      if (petId) {
        fetchPet();
      }
    }, [petId]);
    
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location permission status:", status);
    
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
    
        // Setează starea userLocation aici
        setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    
        if (pet && pet.latitude && pet.longitude) { // Asigură-te că pet are setate latitudinea și longitudinea
          console.log("Pet location:", { latitude: pet.latitude, longitude: pet.longitude });
          const distance = calculateDistance(location.coords.latitude, location.coords.longitude, pet.latitude, pet.longitude);
          console.log("Distance to pet:", distance); // Confirmă că loghează o valoare sensibilă pentru distanță
          setDistanceToPet(distance);
          setLoadingMap(false);
        }
      })();
    }, [pet]); // Dependența este 'pet', astfel încât acest efect să se ruleze din nou atunci când 'pet' se schimbă
    

    const handleDeletePet = () => {
      Alert.alert(
        'Delete Profile',
        'Are you sure you want to delete this profile?',
        [
          { 
            text: 'Cancel',
            onPress: () => console.log('Delete cancelled'),
            style: 'cancel',
          },
          { 
            text: 'Delete', 
            onPress: () => deleteProfile(petId),
            style: 'destructive'
          }
        ],
        { cancelable: true }
      );
    };
  
    const deleteProfile = async (id) => {
      console.log('Deleting profile...');
      try {
        const response = await fetch(`${SERVER_URL}/pets/${petId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Include aici orice alte headere necesare, de exemplu un token de autentificare
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete the profile.');
        }
  
        console.log('Profile deleted successfully!');
        navigation.navigate('DashboardScreen'); // Navigăm înapoi la Dashboard după ștergerea cu succes
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    };
  
    const formatDistance = (distance) => {
      if (distance < 1) {
        // Dacă distanța este mai mică de 1 km, o convertim în metri și rotunjim la cel mai apropiat întreg
        return `${Math.round(distance * 1000)} meters`;
      } else {
        // Dacă distanța este de 1 km sau mai mult, o afișăm ca atare, cu două zecimale
        return `${distance.toFixed(2)} km`;
      }
    };

    const calculateEstimatedTime = (distanceInKm, speedInMps) => {
      if (speedInMps >= 0) {
        const speedInKph = speedInMps * 3.6; // Convertim viteza din m/s în km/h
        if (speedInKph > 0) {
          const timeInHours = distanceInKm / speedInKph;
          const hours = Math.floor(timeInHours);
          const minutes = Math.round((timeInHours - hours) * 60);
          return `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;
        }
        return 'Indisponibilă din cauza lipsei de mișcare';
      }
      return 'Viteza nu este disponibilă';
    };
    const speedInMps = userLocation.speed; // viteza în metri pe secundă
    const distanceInKm = distanceToPet; // distanța în kilometri

    const estimatedTimeText = calculateEstimatedTime(distanceInKm, speedInMps);
        
    

    const formatBirthdate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    if (!pet ) {
      return <LoadingScreen />; // sau orice alt component de "loading" ai prefera
  }

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'location':
              if (loadingMap) {
                return <LoadingScreen/>; 
            }
                  return (
                    <View>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: (userLocation.latitude + pet.latitude) / 2,
                                longitude: (userLocation.longitude + pet.longitude) / 2,
                                latitudeDelta: Math.abs(userLocation.latitude - pet.latitude)+0.02,
                                longitudeDelta: Math.abs(userLocation.longitude - pet.longitude)+0.02,
                            }}
                        >
                            <Marker
                                coordinate={{ latitude: pet.latitude, longitude: pet.longitude }}
                                title={`${pet.name}'s Location`}
                            />
                            <Marker
                                coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                                title="Your Location"
                                pinColor="blue"
                            />
                            <Polyline
                                coordinates={[
                                    { latitude: userLocation.latitude, longitude: userLocation.longitude },
                                    { latitude: pet.latitude, longitude: pet.longitude },
                                ]}
                                strokeColor="#FF0000"
                                geodesic={true}
                                strokeWidth={2}
                            />
                        </MapView>
                        </View>
                        {distanceToPet && (
                    <View>
                    <Text style={styles.distanceText}>Distance to pet: {formatDistance(distanceToPet)}</Text>
                  </View>
                  )}
                   <View>
                      <Text style={styles.distanceText}>
                        Timp estimat de călătorie: {estimatedTimeText}
                      </Text>
                    </View>

                  </View>

              );
                case 'history':
      
               
                
                return (
                  <View style={{ flex: 1 }}>
                  <EventCalendarWithTimeline petId={petId} />
                </View>
                );
              
                  case 'settings':
                    return (
                      <View style={styles.settingsContainer}>
                      <TouchableOpacity
                        style={styles.create}
                        onPress={() => navigation.navigate('CreateEvent', { petId: pet.id })} // Modificat pentru a include ID-ul animalului ca parametru
                      >
                      <FontAwesome5 name="plus-square" size={22} color="white" />
                        <Text style={styles.createtext}>Create Event</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.create}  onPress={() => navigation.navigate('EditProfile', { petId: pet.id })}>
                           < FontAwesome5 name="edit" size={22} color="white" />
                        <Text style={styles.createtext}>Edit Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.create  } onPress={() => {/* Navighează la setările dispozitivului */}}>
                      < FontAwesome5 name="tools" size={22} color="white" />
                        <Text style={styles.createtext}>Device Settings</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.create} onPress={() => {/* Navighează la ecranul următor */}}>
                        <FontAwesome5 name="dog" size={22} color="white" />
                        <Text style={styles.createtext}>Start Walking</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.create} onPress={handleDeletePet}>
                        <FontAwesome5 name="trash" size={22} color="white" />
                        <Text style={styles.createtext}>Delete Profile</Text>
                      </TouchableOpacity>
                     

                    </View>
                    );
                
            default:
                return null;
        }
    };

    const renderActiveIndicator = (section) => {
      if (activeSection === section) {
          return { backgroundColor: 'lightgrey' }; // Stil pentru secțiunea activă
      }
      return {}; // Stil gol pentru secțiunile inactive
  };

  function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
  
    // Adjust months for past month
    if (days < 0) {
      months--;
    }
  
    // If months negative after adjustment, adjust years and set months to positive
    if (months < 0) {
      years--;
      months += 12;
    }
  
    // Generate age string based on years and months calculated
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (years === 1 && months === 0) {
      return `${years} year`;
    } else if (years === 1 && months !== 0) {
      return `${years} year and ${months} months`;
    } else {
      return `${years} years and ${months} months`;
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${day} ${monthNames[monthIndex]} ${year}`;
  }
  
  return (
    <View style={{flex: 1}}>
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <Image source={{ uri: pet.imageUrl }} style={{ width: 150, height: 150, borderRadius: 100 }} />
        
        <View style={{ marginLeft: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name="paw" size={16} color={styles.iconColor.color} />
                        <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                            {pet.name}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <FontAwesome5 name="birthday-cake" size={16} color={styles.iconColor.color} />
                        <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                            {formatDate(pet.birthdate)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <FontAwesome5 name="hourglass-half" size={16} color={styles.iconColor.color} />
                        <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                            {calculateAge(pet.birthdate)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        {pet.sex === 'male' ? (
                            <FontAwesome5 name="mars" size={16} color={styles.iconColor.color} />
                        ) : (
                            <FontAwesome5 name="venus" size={16} color={styles.iconColor.color} />
                        )}
                        <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                            {pet.breed}
                        </Text>
                    </View>
                </View>
            </View>
        
  
      <View style={styles.container}>
        <View style={styles.buttonsRow}>
          {['history', 'location', 'settings'].map((section) => (
            <TouchableOpacity
              key={section}
              style={[
                styles.button,
                isSelected(section) && styles.activeButton, // Aplică stilul pentru butonul selectat
              ]}
              onPress={() => {
                setActiveSection(section);
                if (section === 'history') {
                  // Dacă secțiunea selectată este 'history', încarcă evenimentele
                  // Aici presupunem că petId este disponibil în scopul acestei componente
                  fetchEventsForPet(petId);
                }
              }}
            >
              <Text style={[
                styles.buttonText,
                isSelected(section) && styles.selectedButtonText, // Schimbă culoarea textului pentru butonul selectat
              ]}>
                {section.charAt(0).toUpperCase() + section.slice(1)} {/* Capitalizează prima literă */}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    

      <View style={{ flex: 1, padding: 10, backgroundColor: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
        {renderSectionContent()}
    </View>
    </View>
  );
  
};

export default withDefaultMargins(PetProfile);

