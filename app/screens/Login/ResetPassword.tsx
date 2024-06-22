import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import withDefaultMargins from '../../assets/Margins';
import { useLoginStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';
import { primary } from '../../assets/colors';

const ResetPassword = ({ route }) => {
    const navigation = useNavigation();
    const { email } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fulfilledRequirements, setFulfilledRequirements] = useState([]);
    const [allRequirementsFulfilled, setAllRequirementsFulfilled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const styles = useLoginStyles();

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
        setNewPassword(text);
    };

    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        try {
            validatePassword(newPassword);
            if (fulfilledRequirements.length > 0) {
                throw new Error(fulfilledRequirements[0]);
            }

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
                        onChangeText={(text) => {
                            validatePassword(text);
                        }}
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
                       
                    {loading ? (
                        <ActivityIndicator size="large" color={primary} />
                    ) : (
                        <TouchableOpacity onPress={handleResetPassword} style={[styles.button, !allRequirementsFulfilled && { opacity: 0.5 }]} disabled={!allRequirementsFulfilled}>
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
