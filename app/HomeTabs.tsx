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
          console.log("OK Pressed");
          navigation.navigate('Login'); 
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
        component={() => null} // No component for Logout
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default action
            handleLogout(); // Trigger logout action
          },
        }}
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
