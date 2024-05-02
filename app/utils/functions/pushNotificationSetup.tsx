import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Register for push notifications and get the token
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use a physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const projectId = '7dc185ec-fe57-4bd6-afc1-dd4f7aa6eb43';
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: projectId
  })).data;
  await saveTokenToStorage(token);
  return token;
}

// Save token to AsyncStorage
async function saveTokenToStorage(token) {
  try {
    await AsyncStorage.setItem('expoPushToken', token);
  } catch (error) {
    console.error('Failed to save the push token to storage', error);
  }
}

// Load the token from AsyncStorage
async function loadTokenFromStorage() {
  try {
    return await AsyncStorage.getItem('expoPushToken');
  } catch (error) {
    console.error('Failed to load the push token from storage', error);
    return null;
  }
}

export {
  registerForPushNotificationsAsync,
  saveTokenToStorage,
  loadTokenFromStorage
};
