import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from './Settings';
import EditUser from './EditUser';
import MeasurmentUnit from './MeasurementUnit';
import AlertsNotifications from './AlertsNotifications';
import ChangePassword from './ChangePassword';

const Stack = createNativeStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="EditUser" component={EditUser} options={{ headerShown: false }} />
      <Stack.Screen name="MeasurementUnit" component={MeasurmentUnit} options={{ headerShown: false }} />
      <Stack.Screen name="AlertsNotifications" component={AlertsNotifications} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
