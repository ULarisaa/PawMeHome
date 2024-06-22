import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { SliderHuePicker, SliderSaturationPicker } from 'react-native-slider-color-picker';
import tinycolor from 'tinycolor2';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SERVER_URL } from '../../utils/consts';
import { useColorStyles } from './styles';
import LoadingScreen from '../Loading/Loading';

const SetColors = ({ petId }) => {
  const [eventColors, setEventColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const pickerContainerRef = useRef(null);
  const styles = useColorStyles();

  useEffect(() => {
    fetchEventColors();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [eventColors]);

  const fetchEventColors = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/pets/${petId}/eventColors`);
      const colorsText = await response.text();

      if (response.ok) {
        const colors = JSON.parse(colorsText);
        setEventColors(colors);
      } else {
        console.error('Failed to load event colors:', colorsText);
      }
    } catch (error) {
      console.error('Failed to load event colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (color) => {
    setCurrentColor(tinycolor(color).toHexString());
  };

  const handleEventSelect = (eventValue) => {
    setSelectedEvent(eventValue);
    setCurrentColor(eventColors[eventValue] || '#FFFFFF');
    setColorPickerVisible(true);
  };

  const handleSave = async () => {
    if (selectedEvent) {
      const newColors = { ...eventColors, [selectedEvent]: currentColor };
      setEventColors(newColors);
      setColorPickerVisible(false);

      try {
        const payload = JSON.stringify({ eventColors: newColors });

        const response = await fetch(`${SERVER_URL}/pets/${petId}/updateEventColors`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload,
        });

        if (!response.ok) {
          const responseData = await response.text();
          console.error('Failed to save event colors:', responseData);
        } else {
          console.log('Event colors saved successfully');
        }
      } catch (error) {
        console.error('Failed to save event colors:', error);
      }
    }
  };

  const handleCancel = () => {
    setColorPickerVisible(false);
  };

  const basicEvents = useMemo(() => [
    { label: "Doctor's Appointment", value: 'doctor' },
    { label: 'Vaccination', value: 'vaccination' },
    { label: 'Medication', value: 'medication' },
    { label: 'Custom', value: 'custom' },
  ], []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Set Colors for Events</Text>
      </View>
      <Modal
        visible={colorPickerVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer} ref={pickerContainerRef}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              <Icon name="times" size={30} color="#000" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalDescription}>Slide to select the color:</Text>
              <SliderHuePicker
                trackStyle={{ height: 12, width: 300 }}
                thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
                onColorChange={handleColorChange}
                oldColor={currentColor}
                style={{ marginVertical: 10 }}
              />
              <Text style={styles.modalDescription}>Slide to select the saturation:</Text>
              <SliderSaturationPicker
                trackStyle={{ height: 12, width: 300 }}
                thumbStyle={{ height: 30, width: 30, borderRadius: 15 }}
                onColorChange={handleColorChange}
                oldColor={currentColor}
                style={{ marginVertical: 10 }}
              />
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Color</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        contentContainerStyle={styles.eventListContainer}
        data={basicEvents}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventButton}
            onPress={() => handleEventSelect(item.value)}
          >
            <View style={[styles.colorPreview, { backgroundColor: eventColors[item.value] }]} />
            <Text style={styles.eventLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SetColors;
