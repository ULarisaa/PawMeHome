import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import withDefaultMargins from '../../assets/Margins';
import { usePetProfileStyles } from '../PetProfile/styles';
import LogoHeader from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../utils/functions/AuthContext';
import { SERVER_URL } from '../../utils/consts';

const Settings = () => {
  const navigation = useNavigation();
  const styles = usePetProfileStyles();
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = currentUser?.token;
        if (!token) {
          return;
        }
  
        const response = await fetch(`${SERVER_URL}/users/decodeToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const userData = await response.json();
        const { userId, email } = userData;
        console.log(userData);
  
        setUserId(userId);
        setEmail(email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [currentUser]);

  return (
    <View style={{ flex: 1 }}>
      <LogoHeader />
      <View style={styles.settingsContainer}>
      <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate('EditUser', { userId: userId, email: email })}
        >
          <Icon name="account-circle" size={22} color="white" />
          <Text style={styles.createText}>Edit Account Information</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate('ChangePassword', { userId: userId, email: email })}
        >
          <Icon name="lock" size={22} color="white" />
          <Text style={styles.createText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate('AlertsNotifications')}
        >
          <Icon name="notifications" size={22} color="white" />
          <Text style={styles.createText}>Alerts and Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.create}
          onPress={() => navigation.navigate('MeasurementUnit')}
        >
          <Icon name="rule" size={22} color="white" />
          <Text style={styles.createText}>Change Measurement Unit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default withDefaultMargins(Settings);
