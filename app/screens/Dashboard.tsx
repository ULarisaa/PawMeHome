import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CircularBox from '../components/CircularBox';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    setLoading(true);
    const firestore = getFirestore();
    const querySnapshot = await getDocs(collection(firestore, "pets"));
    const petsArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPets(petsArray);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPets();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {pets.map((pet) => (
          <CircularBox
            key={pet.id}
            name={pet.name}
            imageUrl={{uri: pet.imageUrl}} // Assuming imageUrl is a string URI
            onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
          />
        ))}
        <CircularBox onPress={() => navigation.navigate('AddPet')} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
});

export default Dashboard;
