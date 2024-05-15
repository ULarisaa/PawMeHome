import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import withDefaultMargins from '../../utils/Margins';
import { useLoginStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';

const ResetPassword = ({ route }) => {
    const navigation = useNavigation();
    const { email } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const styles = useLoginStyles();

    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${SERVER_URL}/users/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Your password has been reset successfully');
                navigation.popToTop();
            } else {
                throw new Error(data.message || 'Failed to reset password');
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
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color={primary} />
                    ) : (
                        <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </TouchableOpacity>
                    )}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default withDefaultMargins(ResetPassword);
