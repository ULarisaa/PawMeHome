import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
const NotificationTokenContext = createContext({
  expoPushToken: null,
  alarmToken: null,
  setExpoPushToken: () => {},
});


export const useNotificationToken = () => useContext(NotificationTokenContext);


export const NotificationTokenProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [alarmToken, setAlarmToken] = useState(null);

  useEffect(() => {
    const loadAndRegisterToken = async () => {
      let storedToken = await loadTokenFromStorage();
      if (!storedToken) {
        storedToken = await registerForPushNotificationsAsync();
      }
      if (storedToken) {
        setExpoPushToken(storedToken);
        setAlarmToken(storedToken); 
      }
    };

    loadAndRegisterToken();
  }, []);

  const value = {
    expoPushToken,
    alarmToken,
    setExpoPushToken,
  };

  return (
    <NotificationTokenContext.Provider value={value}>
      {children}
    </NotificationTokenContext.Provider>
  );
};



async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use a physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return null;
  }

  try {
    const projectId = 'ee34fa71-e4ef-4763-bf04-0294bc7643a2'; 
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await saveTokenToStorage(token);
    return token;
  } catch (error) {
    console.error('Failed to get push token:', error);
    return null;
  }
}


async function saveTokenToStorage(token) {
  try {
    await AsyncStorage.setItem('expoPushToken', token);
  } catch (error) {
    console.error('Failed to save the push token to storage:', error);
  }
}


async function loadTokenFromStorage() {
  try {
    return await AsyncStorage.getItem('expoPushToken');
  } catch (error) {
    console.error('Failed to load the push token from storage:', error);
    return null;
  }
}

export {
  registerForPushNotificationsAsync,
  saveTokenToStorage,
  loadTokenFromStorage
};
