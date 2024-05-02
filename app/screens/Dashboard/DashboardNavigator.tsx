// DashboardNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import PetProfile from '../PetProfile/PetProfile';
import CreateEvent from '../PetProfile/CreateEvent';
import EditProfile from '../PetProfile/EditProfile';

const Stack = createNativeStackNavigator();

function DashboardNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardScreen" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="PetProfile" component={PetProfile} options={{ headerShown: false }} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false  }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false  }} />
    </Stack.Navigator>
  );
}

export default DashboardNavigator;
