import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,ActivityIndicator,Alert,KeyboardAvoidingView,ScrollView,Switch} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import countryCodes from '../../utils/CountryCodes.json';
import withDefaultMargins from '../../assets/Margins';
import { SERVER_URL } from '../../utils/consts';
import { useLoginStyles } from './styles';
import Header from '../../components/Header';
import * as Location from 'expo-location';
import { primary } from '../../assets/colors';
import { registerForPushNotificationsAsync, saveTokenToStorage } from '../../utils/functions/pushNotificationSetup';


const SignUp = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [countryPrefix, setCountryPrefix] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fulfilledRequirements, setFulfilledRequirements] = useState([]);
    const [allRequirementsFulfilled, setAllRequirementsFulfilled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const styles = useLoginStyles();

    const countryPrefixOptions = countryCodes.map(country => ({
        label: `${country.flag} (${country.dial_code}) ${country.name}`,
        value: country.dial_code,
        key: country.code,
    }));

    useEffect(() => {
        const allFulfilled = fulfilledRequirements.length === 0;
        setAllRequirementsFulfilled(allFulfilled);
    }, [fulfilledRequirements]);

    const validatePassword = (text) => {
        const requirements = [
            'Password must be at least 10 characters long.',
            'Password must contain at least one uppercase letter.',
            'Password must contain at least one digit.',
            'Password must contain at least one special character.'
        ];

        const fulfilled = [];
        if (text.length >= 10) fulfilled.push('Password must be at least 10 characters long.');
        if (/[A-Z]/.test(text)) fulfilled.push('Password must contain at least one uppercase letter.');
        if (/[0-9]/.test(text)) fulfilled.push('Password must contain at least one digit.');
        if (/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\<\.\>\/\?\\\|\`~]/.test(text)) fulfilled.push('Password must contain at least one special character.');

        setFulfilledRequirements(requirements.filter(req => !fulfilled.includes(req)));
        setPasswordError(fulfilled.length === 4 ? '' : fulfilled[0]);

        setPassword(text);
    };

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
    
        if (passwordError || !allRequirementsFulfilled) {
            Alert.alert(
                'Invalid Password',
                'Please make sure all password requirements are met.'
            );
            return;
        }
    
        setLoading(true);
        setError('');
        try {
         
            const expoToken = await registerForPushNotificationsAsync();
            console.log(expoToken);
    
            const response = await fetch(`${SERVER_URL}/users/initiate-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone,
                    country_prefix: countryPrefix,
                    alarm_token: expoToken, 
                }),
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred while initiating sign up.');
            }
    
            console.log('Initiate sign up successful:', data);
            Alert.alert(
                'Success',
                'Check your email for the verification code.',
                [{ text: 'OK', onPress: () => navigation.navigate('VerifySignUpCode', { email: email }) }]
            );
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                            onChangeText={validatePassword}
                            secureTextEntry={!showPassword} 
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                                <Switch
                                    trackColor={{ false: "gray", true: primary }}
                                    onValueChange={() => setShowPassword(!showPassword)}
                                    value={showPassword}
                                />
                                <Text style={styles.text}>Show Password</Text>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ color: 'red' }}>
                                    {fulfilledRequirements.map((requirement, index) => (
                                        <Text key={index}>{requirement}{'\n'}</Text>
                                    ))}
                                </Text>
                            </View>
                       

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
                            <ActivityIndicator size="large" color={primary} />
                        ) : (
                            <TouchableOpacity onPress={handleSignUp} disabled={!allRequirementsFulfilled} style={[styles.button, { marginTop: 10, opacity: allRequirementsFulfilled ? 1 : 0.5 }]}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        )}
                        {error && <Text style={[styles.errorText, { marginTop: 10 }]}>{error}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.linkButton, { marginVertical: 10 }]}>
                        <Text style={styles.linkText}>
                            Already have an account? Log In
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default withDefaultMargins(SignUp);
