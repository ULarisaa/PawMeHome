import React, { useEffect } from 'react'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './app/utils/functions/AuthContext';
import { ColorSchemeProvider } from './app/utils/ColorSchemeContext';
import { NotificationTokenProvider, useNotificationToken } from './app/utils/functions/NotificationTokenContext';
import { navigationRef, navigate } from './app/utils/functions/NavigationServices';
import * as Notifications from 'expo-notifications';
import Login from './app/screens/Login/Login';
import SignUp from './app/screens/Login/SignUp';
import HomeTabs from './app/HomeTabs';
import ForgotPassword from './app/screens/Login/ForgotPassword';
import VerifyResetCode from './app/screens/Login/VerifyResetCode';
import ResetPassword from './app/screens/Login/ResetPassword';
import VerifySignUpCode from './app/screens/Login/VerifySignUpCode';
import { registerForPushNotificationsAsync } from './app/utils/functions/pushNotificationSetup'; 
import ChangeEmail from './app/screens/Settings/ChangeEmail';

const Stack = createNativeStackNavigator();


function App() {
  const { setExpoPushToken } = useNotificationToken();

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      }
    };

    setupNotifications();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);
      const notificationData = response.notification.request.content.data;
      console.log(notificationData);
      if (notificationData && notificationData.targetScreen === 'PetProfile') {
        navigate('HomeTabs', {
          screen: 'PetProfile',
          params: {
            petId: notificationData.selectedItem, 
            selectedItem: notificationData.selectedType, 
          }
        });
      } else if (notificationData && notificationData.targetScreen === 'Notifications') {
        navigate('HomeTabs', {
          screen: 'Notifications',
          params: {
            selectedType: notificationData.selectedType,
            notificationId: notificationData.notificationId 
          }
        });
      }
    });
    
    

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationTokenProvider>
          <ColorSchemeProvider>
            <NavigationContainer ref={navigationRef}>
              <MyStack />
            </NavigationContainer>
          </ColorSchemeProvider>
        </NotificationTokenProvider>
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
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name="VerifyResetCode" component={VerifyResetCode} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
          <Stack.Screen name="VerifySignUpCode" component={VerifySignUpCode} options={{ headerShown: false }} />
          <Stack.Screen name="ChangeEmail" component={ChangeEmail} options={{ headerShown: false }} />
  
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
