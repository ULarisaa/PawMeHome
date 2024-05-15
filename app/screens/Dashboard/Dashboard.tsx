import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import CircularBox from '../../components/CircularBox/CircularBox';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import LoadingScreen from '../../utils/functions/Loading/Loading';
import withDefaultMargins from '../../utils/Margins';
import { useAuth } from '../../utils/functions/AuthContext';
import { useDashboardStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';

const Dashboard = () => {
  const { currentUser, loading, setLoading } = useAuth(); // Assume setLoading is also provided by context if needed
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const styles = useDashboardStyles();

  const fetchPets = useCallback(async () => {
    if (!currentUser || !currentUser.token) {
      console.error("User is not authenticated");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/pets`, {
        method: 'GET',
       
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const petsArray = await response.json();
      setPets(petsArray);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, setLoading]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]); // Effectively calls fetchPets when the component mounts and whenever fetchPets updates
  
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
            imageUrl={{ uri: pet.imageurl }} 
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
