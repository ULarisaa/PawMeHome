import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import withDefaultMargins from '../../utils/Margins';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { clientId, SERVER_URL } from '../../utils/consts';
import { useLoginStyles } from './styles';
import { useAuth } from '../../utils/functions/AuthContext';


const googleLogo = require('../../utils/images/google.png');

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const styles = useLoginStyles();
    const { login } = useAuth(); 

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
            const success = await login(email, password); // Ensure login either returns true or throws
            if (success) {
                navigation.navigate('HomeTabs'); // Navigate to HomeTabs only if login successful
            } else {
                throw new Error('Login failed unexpectedly');
            }
        } catch (error) {
            setError(error.message || 'Failed to log in');
        } finally {
            setLoading(false);
        }
    };
    
    const handleForgotPassword = async () => {
        if (email) {
            try {
                const response = await fetch(`${SERVER_URL}/users/request-password-reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to send password reset email');
                }

                alert('Password reset email sent. Please check your inbox.');
            } catch (error) {
                setError(error.message);
            }
        } else {
            setError('Please enter your email address.');
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
                    {/* Input fields and login button */}
                    <TextInput
                        style={[styles.input]}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
    
                    <TextInput
                        style={[styles.input]}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={handleForgotPassword}>
                            <Text style={styles.linkText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
                {/* Adjusting the layout to move the new account section closer */}
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
