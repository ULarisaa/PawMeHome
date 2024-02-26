import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface CircularBoxProps {
  name?: string;
  imageUrl?: ImageSourcePropType; // Use ImageSourcePropType for flexibility
  onPress: () => void;
}

const CircularBox: React.FC<CircularBoxProps> = ({ name, imageUrl, onPress }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.circle} onPress={onPress}>
      {imageUrl && (
        <Image source={imageUrl} style={styles.image} />
      )}
      {name && (
        <Text style={styles.name}>{name}</Text>
      )}
      {!imageUrl && !name && (
        <Text style={styles.plus}>+</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  name: {
    position: 'absolute',
    bottom: -20,
    textAlign: 'center',
  },
  plus: {
    fontSize: 24,
    color: '#000',
  },
});

export default CircularBox;
