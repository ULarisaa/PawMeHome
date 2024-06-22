import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LoadingScreen from '../../components/Loading/Loading';
import { SERVER_URL } from '../../utils/consts';
import { useNotificationStyles } from './styles';
import withDefaultMargins from '../../assets/Margins';
import { Icon } from 'react-native-elements';

const Notifications = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const initialType = 'alert'; 
  const selectedNotificationId = route.params?.notificationId;
  const initialSelectedType = route.params?.selectedType || initialType;

  const [selectedTypeKey, setSelectedTypeKey] = useState(initialSelectedType === 'alert' ? 0 : 1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useNotificationStyles();

  useEffect(() => {
    fetchNotifications();
    if (route.params?.selectedType) {
      setSelectedTypeKey(route.params.selectedType === 'alert' ? 0 : 1);
    }
  }, [route.params?.selectedType]);

  useEffect(() => {
    if (selectedNotificationId) {
      markAsRead(selectedNotificationId);
    }
  }, [selectedNotificationId]);

  const fetchNotifications = async () => {
    setLoading(true);
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
      notificationsWithPetDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
      setNotifications(notificationsWithPetDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Notification Deletion",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(`${SERVER_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              if (response.ok) {
                setNotifications(notifications.filter(notification => notification.notification_id !== id));
                setModalVisible(false);
              } else {
                throw new Error('Failed to delete the notification');
              }
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert('Error', 'Failed to delete the notification');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleShowInfo = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setSelectedNotification(null);
    setModalVisible(false);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const filteredNotifications = notifications.filter(notification => notification.type.toLowerCase() === (selectedTypeKey === 0 ? 'alert' : 'reminder'));
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 }}>
        {['alert', 'reminder'].map((type, index) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              selectedTypeKey === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedTypeKey(index)}
          >
            <Text style={[
              styles.buttonText,
              selectedTypeKey === index && styles.selectedButtonText,
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.notification_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem,
              item.notification_id === selectedNotificationId && !item.read && styles.highlightedNotification
            ]}
            onPress={() => {
              markAsRead(item.notification_id);
              handleShowInfo(item);
            }}
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
             
            </View>
          </TouchableOpacity>
        )}
      />
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={closeModal}
>
  <View style={styles.modalContainer}>
    {selectedNotification && (
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Icon name="x" type="feather" size={20} />
        </TouchableOpacity>
        <View style={styles.petIconContainer}>
          <Image source={{ uri: selectedNotification.petIcon }} style={styles.petIcon} />
        </View>
        <Text style={styles.modalTitle}>{selectedNotification.message}</Text>
        {selectedNotification.type === 'alert' && (
          <Text style={styles.modalTimestamp}>
            {new Date(selectedNotification.created_at).toLocaleString()}
          </Text>
        )}
        {selectedNotification.details && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>{selectedNotification.details}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => handleDelete(selectedNotification.notification_id)} style={styles.deleteButton}>
          <Text style={{ color: '#F44336', fontWeight: 'bold' }}>Delete Notification</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
  </Modal>




    </View>
  );
  
};
export default withDefaultMargins(Notifications);
