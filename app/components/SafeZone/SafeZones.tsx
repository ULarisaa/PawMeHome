import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SERVER_URL } from '../../utils/consts';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { useCalendarstyles } from '../Calendar/styles';
import LoadingScreen from '../Loading/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

const SafeZones = ({ petId }) => {
  const [safeZones, setSafeZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useCalendarstyles();
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  useEffect(() => {
    const fetchSafeZones = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/location/pet/${petId}`);
        if (response.ok) {
          const data = await response.json();
          setSafeZones(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch Safe Zones:', response.statusText);
        }
      } catch (error) {
        console.error('Error while fetching Safe Zones:', error.message);
      }
    };

    fetchSafeZones();
  }, [petId, isFocused]); 

  const handleEdit = (safeZone) => {
    navigation.navigate('EditSafeZone', { petId: petId, id: safeZone.id });
  };

  const handleDelete = (safeZone) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this safe zone?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteSafeZone(safeZone),
          style: 'destructive',
        },
      ]
    );
  };

  const deleteSafeZone = async (safeZone) => {
    console.log('Delete safe zone:', safeZone);
    try {
      const response = await fetch(`${SERVER_URL}/location/safe_zone/${safeZone.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSafeZones(safeZones.filter((zone) => zone.id !== safeZone.id));
      } else {
        throw new Error('Failed to delete the safe zone');
      }
    } catch (error) {
      console.error('Error deleting safe zone:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateSafeZone', { petId: petId })}
        >
          <Icon name="plus" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Add New Safe Zone</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={safeZones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <View style={styles.eventMainInfo}>
              <Text style={styles.eventTitle}>{item.name}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                  <Icon name="edit" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                  <Icon name="trash" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default SafeZones;
