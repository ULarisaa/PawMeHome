import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyProfile from './screens/MyProfile';
import AddPet from './screens/AddPet';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import PawIcon from './utils/images/PawIcon';
import { useNavigation } from '@react-navigation/native';
import { primary } from './utils/colors';
import { signOut } from 'firebase/auth';
import { auth } from '../FirebaseConfig';


const Tab = createBottomTabNavigator();
const iconSize = 30; // Define a constant size for all icons

function HomeTabs() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { 
        text: "OK", 
        onPress: () => {
          signOut(auth).then(() => {
            // Sign-out successful.
            console.log("User logged out");
            navigation.navigate('Login');
          }).catch((error) => {
            // An error happened.
            console.error("Logout error:", error);
          });
        } 
      }
    ]);
  };
  
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'MyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AddPet') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Dashboard') {
            return <PawIcon color={color} size={iconSize} />;
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Logout') {
            iconName = 'log-out-outline';
          }
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="MyProfile" component={MyProfile} />
      <Tab.Screen name="AddPet" component={AddPet} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen
      name="Logout"
      component={() => null} // Keep this to satisfy the requirement of having a component.
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault(); // Prevent the default action (navigation)
          handleLogout(); // Execute your logout function
        },
      })}
      options={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="log-out-outline" size={iconSize} color={color} />
        ),
      }}
    />


    </Tab.Navigator>
  );
}

export default HomeTabs;
