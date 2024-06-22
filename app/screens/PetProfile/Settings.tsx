import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import withDefaultMargins from '../../assets/Margins';
import { usePetProfileStyles } from './styles';
import SafeZones from '../../components/SafeZone/SafeZones';
import SetColors from '../../components/Colors/SetColors';
import { useRoute } from '@react-navigation/native';
import ConnectDevice from '../../components/ConnectDevice';

const Settings = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const route = useRoute();
  const { petId } = route.params;
  const styles = usePetProfileStyles();

  return (
    <View style={styles.containerSettings}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 }}>
        {['Safe Zones', 'Connect Device', 'Colors'].map((type, index) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              selectedOption === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <Text style={[
              styles.buttonText,
              selectedOption === index && styles.selectedButtonText,
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedOption === 0 && (
        <SafeZones petId={petId} />
      )}
      {selectedOption === 1 && (
        <ConnectDevice petId={petId} />
      )}
      {selectedOption === 2 && (
        <SetColors petId={petId} />
      )}
    </View>
  );
};

export default withDefaultMargins(Settings);
