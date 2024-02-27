import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StatusBar } from 'react-native';
import HomeTabs from './app/HomeTabs';
import Login from './app/screens/Login';
import PetProfile from './app/screens/PetProfile'; // Import the PetProfile component
import { AuthProvider, useAuth } from './app/utils/functions/AuthContext'
import LoadingScreen from './app/screens/LoadingScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { currentUser, loading } = useAuth();

  // Optionally, you could add a loading state here
  if (loading) {
    return <LoadingScreen />; // Corrected the return statement here
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Stack.Navigator>
        {currentUser ? (
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="PetProfile" component={PetProfile} options={{ headerShown: true }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;

