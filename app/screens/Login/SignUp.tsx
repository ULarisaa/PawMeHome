import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select'; 
import countryCodes from '../../utils/CountryCodes.json';
import withDefaultMargins from '../../utils/Margins';
import { SERVER_URL } from '../../utils/consts';
import { useLoginStyles } from './styles';
import Header from '../../components/Header';
import * as Location from 'expo-location';


const SignUp = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [countryPrefix, setCountryPrefix] = useState(''); // Starea pentru prefixul țării
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const styles = useLoginStyles();

    const countryPrefixOptions = countryCodes.map(country => ({
      label: `${country.flag} (${country.dial_code}) ${country.name}`,
      value: country.dial_code,
      key: country.code,
    }));
    

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission not granted',
            'You need to grant location permissions to use this feature.'
          );
          return false;
        }
        return true;
      };

    const handleSignUp = async () => {
        const hasLocationPermission = await requestLocationPermission();

        if (!hasLocationPermission) {
            Alert.alert(
                'Permission Required',
                'This app needs location permission to function correctly.',
                [{ text: 'OK' }]
            );
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${SERVER_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password:password,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone,
                    country_prefix: countryPrefix, // Trimiteți prefixul țării selectate
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred during sign up.');
            }

            const data = await response.json();
            console.log('Sign up successful:', data);

            setLoading(false);
            navigation.navigate('HomeTabs');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
              <View style={{ flex: 1, padding: 20 }}>
                  <Header />
                  <View style={[styles.container]}>
       
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                          <View style={{ flex: 1, marginRight: 5 }}> 
                              <Text style={{ color: styles.linkText.color, marginBottom: 4 }}>First Name</Text>
                              <TextInput
                                  style={styles.input}
                                  placeholder="First Name"
                                  value={firstName}
                                  onChangeText={setFirstName}
                              />
                          </View>
                          <View style={{ flex: 1, marginLeft: 5 }}>
                              <Text style={{ color: styles.linkText.color, marginBottom: 4 }}>Last Name</Text>
                              <TextInput
                                  style={styles.input}
                                  placeholder="Last Name"
                                  value={lastName}
                                  onChangeText={setLastName}
                              />
                          </View>
                      </View>
               
                      <Text style={{ color: styles.linkText.color, marginBottom: 4, alignSelf: 'flex-start' }}>Email</Text>
                      <TextInput
                          style={styles.input}
                          placeholder="Email"
                          value={email}
                          onChangeText={setEmail}
                          autoCapitalize="none"
                          keyboardType="email-address"
                      />
                 
                 <Text style={{ color: styles.linkText.color, marginBottom: 4, alignSelf: 'flex-start' }}>Password</Text>
                      <TextInput
                          style={styles.input}
                          placeholder="Password"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                      />
      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                          <View style={{ flex: 1, marginRight: 5 }}> 
                              <Text style={{ color: styles.linkText.color, marginBottom: 4 }}>Country Prefix</Text>
                              <RNPickerSelect
                                onValueChange={(value) => {
                                  setCountryPrefix(value);
                                }}
                                items={countryPrefixOptions}
                                style={{ inputIOS: styles.input, inputAndroid: styles.input }}
                                placeholder={{ label: 'Select your country prefix', value: null }}
                                value={countryPrefix}
                              />

                          </View>
                          <View style={{ flex: 3, marginLeft: 5 }}> 
                              <Text style={{ color: styles.linkText.color, marginBottom: 4 }}>Phone Number</Text>
                              <TextInput
                                  style={styles.input}
                                  placeholder="Phone Number"
                                  value={phone}
                                  onChangeText={setPhone}
                                  keyboardType="phone-pad"
                              />
                          </View>
                      </View>

                      {loading ? (
                          <ActivityIndicator style={{ marginVertical: 10 }} />
                      ) : (
                        <TouchableOpacity onPress={handleSignUp} style={[styles.button, { marginTop: 10 }]}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                      )}
                      {error && <Text style={[styles.errorText, { marginTop: 10 }]}>{error}</Text>}
                  </View>
                  {/* Sign Up Link */}
                  <TouchableOpacity onPress={() => {}} style={[styles.linkButton, { marginVertical: 10 }]}>
                  <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
    Already have an account? Log In
</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>
      </KeyboardAvoidingView>
  );
  

            };

export default withDefaultMargins(SignUp);
