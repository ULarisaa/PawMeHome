import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import withDefaultMargins from '../../utils/Margins';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { clientId, SERVER_URL } from '../../utils/consts';
import { useLoginStyles } from './styles';
import { useAuth } from '../../utils/functions/AuthContext';
import { primary } from '../../utils/colors';



const googleLogo = require('../../utils/images/google.png');

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const styles = useLoginStyles();
    const { login } = useAuth(); 
    const [showPassword, setShowPassword] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            // Send the ID token to your backend for verification and further processing
            fetch(`${SERVER_URL}/users/google-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: id_token }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Handle the response from your backend
                navigation.navigate('HomeTabs'); // Navigate based on your application's needs
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [response, navigation]);
    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password); // login should handle setting the user context
            navigation.navigate('HomeTabs');
        } catch (error) {
            setError(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };
    

    const navigateToSignUp = () => {
        navigation.navigate('SignUp');
    };

    const GoogleLoginButton = ({ onPress, disabled }) => {
        return (
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.googleButton, disabled ? styles.disabled : null]}
          >
            <Image source={googleLogo} style={styles.logo} />
            <Text style={styles.buttonGText}>Sign in with Google</Text>
          </TouchableOpacity>
        );
    };

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={{ flex: 1, padding: 20 }}>
                    <Header />
                    <View style={[styles.container]}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword} 
                        />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}>
                            <Switch
                                trackColor={{ false: "gray", true: primary }}
                                onValueChange={() => setShowPassword(!showPassword)}
                                value={showPassword}
                            />
                            <Text style={styles.text}>Show Password</Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.linkText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        {loading ? (
                             <ActivityIndicator size="large" color={primary} />
                        ) : (
                            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>
                        )}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View> 
                    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                        <Text style={ [styles.title, {textAlign: 'center', marginTop: 20, marginBottom: 5 }]}>Don't have an account?</Text>
                        <GoogleLoginButton onPress={() => { promptAsync(); }} disabled={!request} />
                        <Text style={{ textAlign: 'center', marginBottom: 5 }}>or</Text>
                        <TouchableOpacity onPress={navigateToSignUp}>
                            <Text style={[styles.linkText, { textAlign: 'center', marginBottom: 20 }]}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    };
    
    export default withDefaultMargins(Login);