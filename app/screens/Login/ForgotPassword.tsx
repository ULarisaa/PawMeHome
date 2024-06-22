import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import withDefaultMargins from '../../assets/Margins';
import { useLoginStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';
import { primary } from '../../assets/colors';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const styles = useLoginStyles();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${SERVER_URL}/users/password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert(
                    'Success',
                    'Check your email for the reset code.',
                    [
                        { text: 'OK', onPress: () => navigation.navigate('VerifyResetCode', { email: email }) }
                    ]
                );
            } else {
                throw new Error(data.message || 'Failed to send reset email.');
            }
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
    <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
            <Header />
            <View style={[styles.container, { marginTop: 55 }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {loading ? (
                    <ActivityIndicator size="large" color={primary} />
                ) : (
                    <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                        <Text style={styles.buttonText}>Send Reset Email</Text>
                    </TouchableOpacity>
                )}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        </View>
    </ScrollView>
</KeyboardAvoidingView>

    );
};

export default withDefaultMargins(ForgotPassword);
