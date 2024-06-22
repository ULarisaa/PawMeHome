import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Platform, Alert, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import countryCodes from '../../utils/CountryCodes.json';
import { usePetsStyles } from '../AddPet/styles';
import { Colors, primary } from '../../assets/colors';
import { useColorScheme } from '../../utils/ColorSchemeContext';
import withDefaultMargins from '../../assets/Margins';
import { SERVER_URL } from '../../utils/consts';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../utils/functions/AuthContext';

const EditUser = () => {
  const { currentUser } = useAuth();
  const [isDirty, setIsDirty] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryPrefix, setCountryPrefix] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [userId, setUserId] = useState(null);
  const styles = usePetsStyles();
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const { logout } = useAuth();
  const route = useRoute();

  const countryPrefixOptions = countryCodes.map(country => ({
    label: `${country.flag} (${country.dial_code}) ${country.name}`,
    value: country.dial_code,
    key: country.code,
  }));

  const { email: routeEmail, userId: routeUserId } = route.params;

  useEffect(() => {
    setEmail(routeEmail);
    setUserId(routeUserId);

    const fetchData = async () => {
      try {
      
        const userDetailsResponse = await fetch(`${SERVER_URL}/users/${routeUserId}`);
        if (!userDetailsResponse.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userDetails = await userDetailsResponse.json();
        setEmail(userDetails.email);
        setFirstName(userDetails.first_name);
        setLastName(userDetails.last_name);
        setPhone(userDetails.phone_number);
        setCountryPrefix(userDetails.country_prefix);
        setInitialData(userDetails);
        setIsDirty(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [routeUserId, routeEmail]);

  const handleSubmit = async () => {
    if (loading) return; 
    if (!isDirty || !firstName || !lastName || !phone || !countryPrefix) {
        Alert.alert("Error", "Please fill in all the fields and make some changes.");
        return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        old_email: initialData.email, 
        new_email: email, 
        first_name: firstName, 
        last_name: lastName, 
        phone_number: phone, 
        country_prefix: countryPrefix
    };
    
  
    if (!email || initialData.email === email) {
        const response = await fetch(`${SERVER_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
            
        });

        if (!response.ok) throw new Error('Failed to update user');
        console.log('start');
        Alert.alert("Success", "User updated successfully!", [
            {
                text: "OK",
                onPress: () => navigation.navigate('Settings'), 
            },
        ]);
    } else { 
        const responseEmail = await fetch(`${SERVER_URL}/users/update-user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        });
        
        if (!responseEmail.ok) throw new Error('Failed to update email');

       
        await logout(); 
        Alert.alert(
            'Success',
            'Check your email for the verification code.',
            [{ text: 'OK', onPress: () => navigation.navigate('ChangeEmail', { email: email, userId: userId}) }]
        );
    }
} catch (error) {
    Alert.alert("Error", error.message || "There was an error updating the user.");
} finally {
    setLoading(false);
}
};

const handleFieldChange = (setter, newValue, fieldName) => {
  setter(newValue);
  checkIfDirty(newValue, fieldName);
};
const checkIfDirty = (newValue, fieldName) => {
  if (!initialData) return; 
  const isDirty = Object.entries(initialData).some(([key, value]) => {
    if (key === fieldName) {
      return newValue.toString() !== value.toString();
    }
    return false;
  });
  setIsDirty(isDirty);
};



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView>
          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button]}>
              <Icon name="arrow-back" size={24} color={primary} />
              <Text style={styles.createEventButton}>Back</Text>
            </TouchableOpacity>

            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.createText}>Edit Account</Text>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isDirty || !email || !firstName || !lastName || !phone || !countryPrefix}
              style={[styles.button, {
                opacity: (!isDirty || !email || !firstName || !lastName || !phone || !countryPrefix) ? 0.3 : 1
              }]}
            >
              <Icon name="check" size={24} color={primary} />
              <Text style={styles.createEventButton}>Confirm</Text>
            </TouchableOpacity>
          </View>
   
          <View style={{ marginHorizontal: 20 }}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => handleFieldChange(setFirstName, text, 'first_name')}
              style={styles.input}
            />
   
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => handleFieldChange(setLastName, text, 'last_name')}
              style={styles.input}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => handleFieldChange(setEmail, text, 'email')}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
   
   
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <View style={{ flex: 1, marginRight: 5 }}> 
                <Text style={styles.label}>Prefix:</Text>
                <RNPickerSelect
                  onValueChange={(value) => handleFieldChange(setCountryPrefix, value, 'country_prefix')}
                  items={countryPrefixOptions}
                  style={{ inputIOS: styles.input, inputAndroid: styles.input }}
                  placeholder={{ label: 'Select your country prefix', value: null }}
                  value={countryPrefix}
                />
              </View>
              <View style={{ flex: 3, marginLeft: 5 }}> 
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={(text) => handleFieldChange(setPhone, text, 'phone')}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={primary} />
            ) : null}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default withDefaultMargins(EditUser);

