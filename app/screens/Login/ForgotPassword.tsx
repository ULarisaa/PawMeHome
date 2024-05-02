import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../FirebaseConfig';
import withDefaultMargins from '../../utils/Margins';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            setMessage('Check your email to reset your password.');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            {loading ? (
                <ActivityIndicator />
            ) : (
                <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                    <Text style={styles.buttonText}>Send Reset Email</Text>
                </TouchableOpacity>
            )}
            {message ? <Text style={styles.messageText}>{message}</Text> : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};


const styles = StyleSheet.create({
    linkButton: {
        marginTop: 10,
    },
    linkText: {
        color: 'blue',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});


export default withDefaultMargins(ForgotPassword);