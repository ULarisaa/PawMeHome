import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { primary } from '../../assets/colors';
import withDefaultMargins from '../../assets/Margins';
import { Icon } from 'react-native-elements';
import { usePetsStyles } from '../AddPet/styles';
import { SERVER_URL } from '../../utils/consts';
import { useAuth } from '../../utils/functions/AuthContext';

const AlertsNotifications = () => {
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [initialAlertsEnabled, setInitialAlertsEnabled] = useState(false);
  const [initialNotificationsEnabled, setInitialNotificationsEnabled] = useState(false);
  const [userId, setUserId] = useState(null); 
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const styles = usePetsStyles();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = currentUser?.token;
        if (!token) {
          return;
        }

        const response = await fetch(`${SERVER_URL}/users/decodeToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user ID');
        }

        const userData = await response.json();
        const userId = userData.userId;
        setUserId(userId); 


        const settingsResponse = await fetch(`${SERVER_URL}/app/app-settings/${userId}`);
        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch existing settings');
        }
        const settingsData = await settingsResponse.json();
        setIsAlertsEnabled(settingsData.alert);
        setIsNotificationsEnabled(settingsData.notifications);
        setInitialAlertsEnabled(settingsData.alert); 
        setInitialNotificationsEnabled(settingsData.notifications); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleConfirm = async () => {
    try {
      const token = currentUser?.token;
      if (!token || !userId) {
        return;
      }

      const settingsResponse = await fetch(`${SERVER_URL}/app/change-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, alert: isAlertsEnabled, notifications: isNotificationsEnabled }),
      });
      console.log(JSON.stringify({ user_id: userId, alert: isAlertsEnabled, notifications: isNotificationsEnabled }));

      if (settingsResponse.ok) {
        Alert.alert('Success', 'Settings saved successfully!');
        navigation.navigate('Settings');
      } else {
        Alert.alert('Error', 'Failed to save settings. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again later.');
    }
  };

  const hasChanges = () => {
    return (
      isAlertsEnabled !== initialAlertsEnabled || isNotificationsEnabled !== initialNotificationsEnabled
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonsRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
          <Icon name="arrow-back" size={24} color={primary} />
          <Text style={styles.createEventButton}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.createText}> Alerts and Notifications</Text>
        </View>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, { opacity: hasChanges() ? 1 : 0.5 }]}
          disabled={!hasChanges()}
        >
          <Icon name="check" size={24} color={primary} />
          <Text style={styles.createEventButton}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.pickerTitle}>{isAlertsEnabled ? 'Alerts turned on' : 'Alerts turned off'}</Text>
        <Switch
          onValueChange={setIsAlertsEnabled}
          value={isAlertsEnabled}
          trackColor={{ false: 'gray', true: primary }}
          style={{ marginBottom: 5 }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.pickerTitle}>{isNotificationsEnabled ? 'Notifications turned on' : 'Notifications turned off'}</Text>
        <Switch
          trackColor={{ false: 'gray', true: primary }}
          style={{ marginBottom: 5 }}
          onValueChange={setIsNotificationsEnabled}
          value={isNotificationsEnabled}
        />
      </View>
    </View>
  );
};

export default withDefaultMargins(AlertsNotifications);
