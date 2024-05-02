import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CircularBox from '../../components/CircularBox/CircularBox';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import LoadingScreen from '../../utils/functions/Loading/Loading';
import withDefaultMargins from '../../utils/Margins';
import { SERVER_URL } from '../../utils/consts';
import { useDashboardStyles } from './styles';

const Dashboard = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = useDashboardStyles();
  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/pets`);
      const petsArray = await response.json();
      setPets(petsArray);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPets();
    }, [])
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
    <Header />
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {pets.map((pet) => (
          <CircularBox
            key={pet.id}
            name={pet.name}
            imageUrl={{uri: pet.imageurl}} 
            onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
            textStyle={styles.text}
          />
        ))}
        <CircularBox onPress={() => navigation.navigate('AddPet')} />
      </ScrollView>
    </View>
  );
};
export default withDefaultMargins(Dashboard);