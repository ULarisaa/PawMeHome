import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import CircularBox from '../../components/CircularBox/CircularBox';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import LoadingScreen from '../../components/Loading/Loading';
import withDefaultMargins from '../../assets/Margins';
import { useAuth } from '../../utils/functions/AuthContext';
import { useDashboardStyles } from './styles';
import { SERVER_URL } from '../../utils/consts';

const Dashboard = () => {
  const { currentUser, loading, setLoading } = useAuth();
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const styles = useDashboardStyles();

  const fetchPetsByUser = async () => {
    setLoading(true);
    try {
      const responseToken = await fetch(`${SERVER_URL}/users/decodeToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentUser.token }),
      });

      if (!responseToken.ok) {
        throw new Error('Failed to decode token');
      }

      const { userId } = await responseToken.json();
      const responsePets = await fetch(`${SERVER_URL}/pets/getByUserId/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!responsePets.ok) {
        throw new Error(`HTTP error! status: ${responsePets.status}`);
      }

      const petsArray = await responsePets.json();
      setPets(petsArray);
    } catch (error) {
      console.error('Failed to fetch pets by user:', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchPetsByUser();
    }, [currentUser.token])
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
