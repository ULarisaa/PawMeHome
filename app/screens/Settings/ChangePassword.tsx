import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Platform, Alert, ActivityIndicator, Switch } from 'react-native';
import { primary } from '../../assets/colors';
import withDefaultMargins from '../../assets/Margins';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SERVER_URL } from '../../utils/consts';
import { useAuth } from '../../utils/functions/AuthContext';
import { usePetProfileStyles } from '../PetProfile/styles';

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [fulfilledRequirements, setFulfilledRequirements] = useState([]);
    const [allRequirementsFulfilled, setAllRequirementsFulfilled] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const styles = usePetProfileStyles();
    const navigation = useNavigation();
    const [email, setEmail]= useState('');

    const route = useRoute();
    const { logout } = useAuth();

    const { email: routeEmail, userId: routeUserId } = route.params;

    useEffect(() => {
        setUserId(routeUserId);
        setEmail(routeEmail);
    }, [routeUserId, routeEmail]);

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

    const handleSubmit = async () => {
        if (loading) return; 
        if (!newPassword) {
            Alert.alert("Error", "Please fill in all the fields and make some changes.");
            return;
        }

        try {
            setLoading(true);
            await handleResetPassword();
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
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
            console.log(routeEmail);
            const data = await response.json();
        
            if (response.ok) {
                Alert.alert('Success', 'Your password has been reset successfully');
                await logout(); 
            } else {
                throw new Error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        }
    };

    const handleFieldChange = (setter, newValue, fieldName) => {
        setter(newValue);
        checkIfDirty(newValue, fieldName);
    };

    const checkIfDirty = (newValue, fieldName) => {
        
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
                            <Text style={styles.createText}>Change Password</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={fulfilledRequirements.length > 0 || loading}
                            style={[styles.button, {
                                opacity: (fulfilledRequirements.length > 0 || loading) ? 0.3 : 1
                            }]}
                        >
                            <Icon name="check" size={24} color={primary} />
                            <Text style={styles.createEventButton}>Confirm</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        {/* Type of Event */}
                        <Text style={styles.pickerTitle}>Enter new password:</Text>
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
                        ) : null}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default withDefaultMargins(ChangePassword);
