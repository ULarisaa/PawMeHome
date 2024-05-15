import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './app/utils/functions/AuthContext';
import { ColorSchemeProvider } from './app/utils/ColorSchemeContext';
import { useNotificationToken } from './app/utils/functions/NotificationTokenContext';
import { navigationRef, navigate } from './app/utils/functions/NavigationServices';
import Login from './app/screens/Login/Login';
import SignUp from './app/screens/Login/SignUp';
import HomeTabs from './app/HomeTabs';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './app/utils/functions/pushNotificationSetup'; // Adjust this import path to where you manage notification setup
import ForgotPassword from './app/screens/Login/ForgotPassword';
import VerifyResetCode from './app/screens/Login/VerifyResetCode';
import ResetPassword from './app/screens/Login/ResetPassword';
import VerifySignUpCode from './app/screens/Login/VerifySignUpCode';

const Stack = createNativeStackNavigator();

function App() {
  const { setExpoPushToken } = useNotificationToken();

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token); // This will save the token in the context and AsyncStorage
      }
    };

    setupNotifications();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);
      const notificationData = response.notification.request.content.data;
      if (notificationData && notificationData.targetScreen === 'Notifications') {
        navigate('Notifications', { selectedType: notificationData.selectedType });
      }
    });

    // Return a cleanup function to remove subscriptions when the component unmounts
    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ColorSchemeProvider>
          <NavigationContainer ref={navigationRef}>
            <MyStack />
          </NavigationContainer>
        </ColorSchemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const MyStack = () => {
  const { currentUser } = useAuth();

  return (
    <Stack.Navigator>
      {currentUser ? (
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyResetCode" component={VerifyResetCode} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
          <Stack.Screen name="VerifySignUpCode" component={VerifySignUpCode} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
