import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Platform, Alert, ActivityIndicator } from 'react-native';
import { primary } from '../assets/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SERVER_URL } from '../utils/consts';
import { useAuth } from '../utils/functions/AuthContext';
import { usePetProfileStyles } from '../screens/PetProfile/styles';

const ConnectDevice = ({ petId }) => {
    const [loading, setLoading] = useState(false);
    const [deviceId, setDeviceId] = useState('');
    const [initialDeviceId, setInitialDeviceId] = useState('');
    const [error, setError] = useState('');
    const styles = usePetProfileStyles();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const route = useRoute();
    const { logout } = useAuth();

    const { email: routeEmail, userId: routeUserId } = route.params;

    useEffect(() => {
        setEmail(routeEmail);
        fetchCurrentDeviceId();
    }, [routeEmail]);

    const fetchCurrentDeviceId = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SERVER_URL}/pets/${petId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            
            if (response.ok) {
                setDeviceId(data.device_id || '');
                setInitialDeviceId(data.device_id || '');
            } else {
                throw new Error(data.message || 'Failed to fetch device ID');
            }
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (loading) return; 
        if (!deviceId) {
            Alert.alert("Error", "Please enter a device ID.");
            return;
        }

        Alert.alert(
            'Confirm',
            'Are you sure you want to connect this device?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await handleSaveDeviceId();
                        } catch (error) {
                            setError(error.message);
                            Alert.alert('Error', error.message);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleSaveDeviceId = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/location/addDevice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ device_id: deviceId, pet_id: petId }),
            });

            const data = await response.json();
        
            if (response.ok) {
                Alert.alert('Success', 'Device has been connected successfully');
                navigation.goBack();
            } else {
                throw new Error(data.message || 'Failed to connect device');
            }
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        }
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
                    <TouchableOpacity  style={[styles.button]}>
                            <Icon name="arrow-back" size={24} color={styles.textinvisible.color} />
                            <Text style={styles.textinvisible}>Back</Text>
                    </TouchableOpacity>
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.createText}>Connect new device</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={deviceId === initialDeviceId || loading}
                            style={[styles.button, { opacity: deviceId === initialDeviceId || loading ? 0.3 : 1 }]}
                        >
                            <Icon name="check" size={24} color={primary} />
                            <Text style={styles.createEventButton}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={styles.pickerTitle}>Enter device id:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter device id"
                            value={deviceId}
                            onChangeText={setDeviceId}
                        />
                        
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

export default ConnectDevice;
