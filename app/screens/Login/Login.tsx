import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import withDefaultMargins from '../../assets/Margins';
import { useLoginStyles } from './styles';
import { useAuth } from '../../utils/functions/AuthContext';
import { primary } from '../../assets/colors';
import { Alert } from 'react-native';

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth(); 
    const [showPassword, setShowPassword] = useState(false);
    const styles=useLoginStyles();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigation.navigate('HomeTabs');
        } catch (error) {
            if (error.message === 'Account not activated') {
                Alert.alert(
                    'Account Not Activated',
                    'Your account has not been activated yet. A verification code has been sent to your email. Please check your email and verify your account.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
                navigation.navigate('VerifySignUpCode', { email: email });
            } else {
                setError(error.message || 'Login failed. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const navigateToSignUp = () => {
        navigation.navigate('SignUp');
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
                    <TouchableOpacity onPress={navigateToSignUp}>
                        <Text style={[styles.linkText, { textAlign: 'center', marginBottom: 20 }]}>Create an account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};



export default withDefaultMargins(Login);
