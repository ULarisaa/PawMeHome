import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AddPet from './screens/AddPet/AddPet';
import Dashboard from './screens/Dashboard/Dashboard';
import Settings from './screens/Settings/Settings';
import Notifications from './screens/Notifications/Notifications';
import { useNavigation } from '@react-navigation/native';
import { Colors } from './utils/colors';
import DashboardNavigator from './screens/Dashboard/DashboardNavigator';
import { useColorScheme } from './utils/ColorSchemeContext';
import { SERVER_URL } from './utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './utils/functions/AuthContext';

const Tab = createBottomTabNavigator();
const iconSize = 30;

const fetchUnreadNotificationsCount = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/notifications/unreadCount`);
    const data = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching notifications count:', error);
    return 0;
  }
};

const NotificationIcon = ({ focused, color, notificationCount, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View>
      <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={iconSize} color={color} />
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notificationCount}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

function HomeTabs() {
  const scheme = useColorScheme(); 
  const navigation = useNavigation();
  const [notificationCount, setNotificationCount] = useState(0);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchUnreadNotificationsCount();
      setNotificationCount(count);
    };
  
    fetchCount();
  
    const interval = setInterval(fetchCount, 1000); // Verifică la fiecare 10 secunde
  
    return () => clearInterval(interval); // Curăță intervalul la demontarea componentei
  }, []);
  


  const handleLogout = async () => {
    try {
        await logout();
        navigation.navigate('Login'); // Presupunând că 'Login' este numele rutei către pagina de login
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          switch (route.name) {
            case 'Dashboard':
              return <Ionicons name={focused ? 'paw' : 'paw-outline'} size={iconSize} color={color} />;
              case 'Notifications':
                return (
                  <NotificationIcon
                    focused={focused}
                    color={color}
                    notificationCount={notificationCount}
                    onPress={() => navigation.navigate('Notifications')} // Adaugă această linie
                  />
                );
            case 'AddPet':
              return <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={iconSize} color={color} />;
            case 'Settings':
              return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={iconSize} color={color} />;
            case 'Logout':
              return <Ionicons name="log-out-outline" size={iconSize} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: Colors[scheme].primary,
        tabBarInactiveTintColor: Colors[scheme].inactive,
        tabBarStyle: {
          backgroundColor: Colors[scheme].menu // Culoarea de fundal a tab bar-ului bazată pe schema
        },
      })}
    >
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="AddPet" component={AddPet} />
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen
        name="Logout"
        component={View} 
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="log-out-outline" size={iconSize} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
  },
});

export default HomeTabs;
