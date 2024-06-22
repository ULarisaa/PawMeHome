import React, { useState, useEffect, useRef } from 'react';
import {View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert, ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Header from '../../components/Header';
import withDefaultMargins from '../../assets/Margins';
import { useLoginStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';
import { primary } from '../../assets/colors';

const VerifySignUpCode = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const email = route.params?.email;
    const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);  
    const [allowResend, setAllowResend] = useState(false);
    const styles = useLoginStyles();
    const inputRefs = useRef(verificationCode.map(() => React.createRef()));

    useEffect(() => {
        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        if (timeLeft === 0) setAllowResend(true);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerifyCode = async () => {
 
        if (verificationCode.includes('')) {
            Alert.alert('Incomplete Code', 'Please fill in all the code fields.');
            return;
        }
        setLoading(true); 
        setError(''); 
    
        try {
            const fullCode = verificationCode.join(''); 
            console.log('start', verificationCode); 
            const response = await fetch(`${SERVER_URL}/users/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode }), 
            });
    
            const data = await response.json(); 
    
            if (!response.ok) {
                throw new Error(data.message || 'Invalid or expired verification code');
            }

            Alert.alert('Success', data.message, [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login') 
                }
            ]);
        } catch (error) {
            setError(error.message); 
            Alert.alert('Error', error.message); 
        } finally {
            setLoading(false); 
        }
    };
    
    

    const resendVerificationCode = async () => {
        if (!allowResend) return;
        try {
            const response = await fetch(`${SERVER_URL}/users/resend-verification`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error('Failed to resend verification code');
            setTimeLeft(60);
            setAllowResend(false);
            Alert.alert( 'Verification code resent successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleInput = (text, index) => {
        const newCode = [...verificationCode];
        newCode[index] = text;
        setVerificationCode(newCode);
        if (text && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView style={{ flex: 1 }}>
                <View style={{ padding: 20 }}>
                    <Header />
                    <View style={[styles.container, { marginTop: 55 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
                            {verificationCode.map((code, index) => (
                                <TextInput
                                    key={index}
                                    ref={ref => inputRefs.current[index] = ref}
                                    style={styles.codeInput}
                                    value={code}
                                    onChangeText={text => handleInput(text, index)}
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    returnKeyType="done"
                                    textContentType="oneTimeCode"
                                />
                            ))}
                        </View>
                        {loading ? (
                            <ActivityIndicator size="large" color={primary} />
                        ) : (
                            <TouchableOpacity onPress={handleVerifyCode} style={styles.button}>
                                <Text style={styles.buttonText}>Verify Code</Text>
                            </TouchableOpacity>
                        )}
                      <TouchableOpacity
                            onPress={resendVerificationCode}
                            disabled={!allowResend}
                            style={[
                                styles.resendButton, 
                
                            ]}
                        >
                            <Text style={[
                                styles.resendButtonText,
                                allowResend ? styles.textEnabled : styles.textDisabled
                            ]}>
                                Resend Code
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.timerText}>
                            {allowResend ? 'You can now resend the code.' : `Resend available in ${timeLeft} seconds`}
                        </Text>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default withDefaultMargins(VerifySignUpCode);
