import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabs from './app/HomeTabs';
import Login from './app/screens/Login';
import PetProfile from './app/screens/PetProfile'; // Import the PetProfile component

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="PetProfile" component={PetProfile} options={{ headerShown: true }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
