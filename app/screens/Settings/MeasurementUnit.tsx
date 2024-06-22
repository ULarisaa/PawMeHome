import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { primary } from '../../assets/colors';
import withDefaultMargins from '../../assets/Margins';
import { Icon } from 'react-native-elements';
import { usePetsStyles } from '../AddPet/styles';
import { SERVER_URL } from '../../utils/consts';
import { useAuth } from '../../utils/functions/AuthContext';

const MeasurementUnit = () => {
  const [selectedUnit, setSelectedUnit] = useState('metric');
  const [initialUnit, setInitialUnit] = useState('metric');
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const styles = usePetsStyles();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = currentUser?.token;
        if (!token) {
          return;
        }

        const response = await fetch(`${SERVER_URL}/users/decodeToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user ID');
        }

        const userData = await response.json();
        const userId = userData.userId;

        setUserId(userId);

  
        const unitsResponse = await fetch(`${SERVER_URL}/app/app-settings/${userId}`);
        if (!unitsResponse.ok) {
          throw new Error('Failed to fetch existing units settings');
        }
        const unitsData = await unitsResponse.json();
        const existingUnits = unitsData.units;

        setSelectedUnit(existingUnits); 
        setInitialUnit(existingUnits); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
  };

  const handleConfirm = async () => {
    try {
      const token = currentUser?.token;
      if (!token || !userId) {
        return;
      }

   
      const unitsResponse = await fetch(`${SERVER_URL}/app/change-units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, units: selectedUnit }),
      });

      if (unitsResponse.ok) {
        Alert.alert('Success', 'Measurement units saved successfully!');
        navigation.navigate('Settings'); 
      } else {
        Alert.alert('Error', 'Failed to save measurement units. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving measurement units:', error);
      Alert.alert('Error', 'Failed to save measurement units. Please try again later.');
    }
  };

  const hasChanges = () => {
    return selectedUnit !== initialUnit;
  };

  return (
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
            <Text style={styles.createText}> Measurement Units</Text>
          </View>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.button, { opacity: hasChanges() ? 1 : 0.5 }]}
            disabled={!hasChanges()}
          >
            <Icon name="check" size={24} color={primary} />
            <Text style={styles.createEventButton}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleUnitChange('metric')}>
          <View style={styles.unitContainer}>
            <MaterialIcons
              name={selectedUnit === 'metric' ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={primary}
            />
            <Text style={[styles.unitText, selectedUnit === 'metric' && styles.selectedUnit]}>Metric (kg, cm)</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUnitChange('imperial')}>
          <View style={styles.unitContainer}>
            <MaterialIcons
              name={selectedUnit === 'imperial' ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={primary}
            />
            <Text style={[styles.unitText, selectedUnit === 'imperial' && styles.selectedUnit]}>Imperial (lbs, in)</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withDefaultMargins(MeasurementUnit);
