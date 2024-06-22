
import React from 'react';
import {  Text, Image, TouchableOpacity, ImageSourcePropType, TextStyle } from 'react-native';
import { useCircularBoxStyles } from './styles';

interface CircularBoxProps {
  name?: string;
  imageUrl?: ImageSourcePropType;
  onPress: () => void;
  textStyle?: TextStyle;
}

const CircularBox: React.FC<CircularBoxProps> = ({ name, imageUrl, onPress, textStyle }) => {
  const styles = useCircularBoxStyles(); 

  return (
    <TouchableOpacity style={styles.circle} onPress={onPress}>
      {imageUrl && (
        <Image source={imageUrl} style={styles.image} />
      )}
      {name && (
        <Text style={[styles.name, textStyle]}>{name}</Text>
      )}
      {!imageUrl && !name && (
        <Text style={styles.plus}>+</Text>
      )}
    </TouchableOpacity>
  );
};

export default CircularBox;
