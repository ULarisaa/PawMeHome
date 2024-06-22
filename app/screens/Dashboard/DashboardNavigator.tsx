import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import PetProfile from '../PetProfile/PetProfile';
import CreateEvent from '../PetProfile/CreateEvent';
import EditProfile from '../PetProfile/EditProfile';
import EditEvent from '../PetProfile/EditEvent';
import Settings from '../PetProfile/Settings';
import CreateSafeZone from '../../components/SafeZone/CreateSafeZone';
import EditSafeZone from '../../components/SafeZone/EditSafeZone';
import EditUser from '../Settings/EditUser';
import AddPet from '../AddPet/AddPet';

const Stack = createNativeStackNavigator();

function DashboardNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardScreen" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="PetProfile" component={PetProfile} options={{ headerShown: false }} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false  }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false  }} />
      <Stack.Screen name="EditEvent" component={EditEvent} options={{ headerShown: false  }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false  }} />
      <Stack.Screen name="CreateSafeZone" component={CreateSafeZone} options={{ headerShown: false  }} />
      <Stack.Screen name="EditSafeZone" component={EditSafeZone} options={{ headerShown: false  }} />
      <Stack.Screen name="EditUser" component={EditUser} options={{ headerShown: false  }} />
      <Stack.Screen name="AddPet"component={AddPet} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}

export default DashboardNavigator;
