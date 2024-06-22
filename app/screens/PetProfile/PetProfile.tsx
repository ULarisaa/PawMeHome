import React, { useEffect, useState } from 'react';
import { View, Text, Image,  Alert, Linking, TouchableOpacity } from 'react-native';
import withDefaultMargins from '../../assets/Margins';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingScreen from '../../components/Loading/Loading';
import { SERVER_URL } from '../../utils/consts';
import { usePetProfileStyles } from './styles';
import EventCalendarWithTimeline from '../../components/Calendar/Calendar';
import LocationComponent from '../../components/LocationComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PetProfile = () => {
  const [pet, setPet] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { petId, selectedItem } = route.params;
  const [activeSection, setActiveSection] = useState(selectedItem || 'history'); // Setează activeSection pe baza selectedItem; dacă nu este disponibil, setează pe "history"

  const styles = usePetProfileStyles();
  const [loadingMap, setLoadingMap] = useState(true);
  const isSelected = (section) => activeSection === section;
  const [isPressed, setIsPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  
  const handleToggle = async () => {
    if (loading) return; // Evită trimiterea de cereri multiple
    setLoading(true);
    setError('');

    try {
        const newState = !isPressed;
        const response = await fetch(`${SERVER_URL}/location/updateIsWalking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ petId, isWalking: newState }),
        });

        const data = await response.text(); // Citeste raspunsul ca text

        if (!response.ok) {
            throw new Error(data || 'Failed to update state'); // Foloseste raspunsul ca mesaj de eroare
        }

        Alert.alert('Success', `Walking state updated to ${newState ? 'active' : 'inactive'}`);
        setIsPressed(newState); // Actualizează starea locală
        
    } catch (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
    } finally {
        setLoading(false);
    }
};


    const fetchEventsForPet = async (petId) => {
      try {
          const response = await fetch(`${SERVER_URL}/events/pets/${petId}`);
          const { allEvents } = await response.json(); 
    
          setEvents(allEvents); 
      } catch (err) {
          console.error('Error fetching events:', err); 
      }
    };
    

  useEffect(() => {
    if (petId) { 
        fetchEventsForPet(petId);
    }
}, []); 

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
        setLoadingMap(false); 
      }
      };
      const fetchPetData = async () => {
        console.log('start', petId);
        try {
          const response = await fetch(`${SERVER_URL}/location/walking/${petId}`);
          console.log(response);
          if (!response.ok) {
            throw new Error('Failed to fetch pet data');
          }
          console.log(response);
          const petData = await response.json();
          console.log('stare',petData);

          setIsPressed(petData.is_walking); 
        } catch (error) {

        }
      };
    
      if (petId) {
        fetchPet();
        fetchPetData();
      }
    }, [petId]);



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
      
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete the profile.');
        }
  
        console.log('Profile deleted successfully!');
        navigation.navigate('DashboardScreen'); 
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    };
  

  

    if (!pet ) {
      return <LoadingScreen />; 
  }

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'location':
              return (
                <View style={{ flex: 1 }}>
                  <LocationComponent pet={pet} loadingMap={loadingMap}  navigation={navigation} /> 

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
                        onPress={() => navigation.navigate('CreateEvent', { petId: pet.id })}
                      >
                        <Icon name="add-circle" size={22} color="white" />
                        <Text style={styles.createText}>Create Event</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.create}
                        onPress={() => navigation.navigate('EditProfile', { petId: pet.id })}
                      >
                        <Icon name="edit" size={22} color="white" />
                        <Text style={styles.createText}>Edit Profile</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.create}
                        onPress={() => navigation.navigate('Settings', { petId: pet.id })}
                      >
                        <Icon name="settings" size={22} color="white" />
                        <Text style={styles.createText}>Settings</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                          style={[styles.create, isPressed ? styles.buttonEnabled : styles.buttonDisabled]}
                          onPress={handleToggle}
                      >
                          <Icon name="pets" size={22} color="white" />
                          <Text style={styles.createText}>{isPressed ? 'Stop Walking' : 'Start Walking'}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.create} onPress={handleDeletePet}>
                        <Icon name="delete" size={22} color="white" />
                        <Text style={styles.createText}>Delete Profile</Text>
                      </TouchableOpacity>

                     

                    </View>
                    );
                
            default:
                return null;
        }
    };



  function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
  

    if (days < 0) {
      months--;
    }
  

    if (months < 0) {
      years--;
      months += 12;
    }
  

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (years === 1 && months === 0) {
      return `${years} year`;
    } else if (years === 1 && months !== 0) {
      return `${years} year and ${months} months`;
    }else if ( months === 0) {
      return `${years} years`;
    }else {
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
                      <Icon name="pets" size={16} color={styles.iconColor.color} />
                      <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                        {pet.name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Icon name="cake" size={16} color={styles.iconColor.color} />
                      <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                        {formatDate(pet.birthdate)}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Icon name="hourglass-bottom" size={16} color={styles.iconColor.color} />
                      <Text style={[styles.textColor, { marginLeft: 5, fontSize: 16, lineHeight: 20 }]}>
                        {calculateAge(pet.birthdate)}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      {pet.sex === 'male' ? (
                        <Icon name="male" size={16} color={styles.iconColor.color} />
                      ) : (
                        <Icon name="female" size={16} color={styles.iconColor.color} />
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
                isSelected(section) && styles.activeButton, 
              ]}
              onPress={() => {
                setActiveSection(section);
                if (section === 'history') {
                  fetchEventsForPet(petId);
                }
              }}
            >
              <Text style={[
                styles.buttonText,
                isSelected(section) && styles.selectedButtonText, 
              ]}>
                {section.charAt(0).toUpperCase() + section.slice(1)} 
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

function setError(message: any) {
  throw new Error('Function not implemented.');
}

