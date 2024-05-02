import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Button, Dimensions } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import withDefaultMargins from '../../utils/Margins';
import LoadingScreen from '../../utils/functions/Loading/Loading';
import { SERVER_URL } from '../../utils/consts';
import { useNotificationStyles } from './styles';
import { primary } from '../../utils/colors';

const Notifications = () => {
  const route = useRoute();
  const initialType = route.params?.selectedType || 'alert'; // Verifică dacă există parametrii, altfel setează 'alert' implicit
  const [selectedType, setSelectedType] = useState(initialType);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useNotificationStyles();
  const isSelected = (type) => selectedType === type;

  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${SERVER_URL}/notifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      let notificationsArray = await response.json();
      const notificationsWithPetDetails = await Promise.all(notificationsArray.map(async (notification) => {
        const petResponse = await fetch(`${SERVER_URL}/pets/${notification.pet_id}`);
        if (!petResponse.ok) {
          throw new Error(`Failed to fetch pet details for petId ${notification.pet_id}`);
        }
        const petDetails = await petResponse.json();
        return { ...notification, petIcon: petDetails.imageurl };
      }));
      setNotifications(notificationsWithPetDetails);
    } catch (error) {
      console.error(error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      setNotifications(notifications.map(notification => 
        notification.notification_id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error(error);
    }
  };
  

  if (loading) {
    return <LoadingScreen />;
  }
 
  const filteredNotifications = notifications.filter(notification => notification.type.toLowerCase() === selectedType);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15}}>
        {['alert', 'reminder'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              isSelected(type) && styles.selectedButton, // Aplică stilul pentru butonul selectat
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.buttonText,
              isSelected(type) && styles.selectedButtonText, // Schimbă culoarea textului pentru butonul selectat
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalizează prima literă */}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.notification_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => markAsRead(item.notification_id)}
          >
            <View style={styles.notificationContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
                    {!item.read && <View style={styles.unreadIndicator} />}
                    <Text style={styles.notificationType}>{item.type}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                </View>
                <Image source={{ uri: item.petIcon }} style={styles.petIcon} />
              </View>
              <Text style={styles.notificationTimestamp}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default withDefaultMargins(Notifications);
