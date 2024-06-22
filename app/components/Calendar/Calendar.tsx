import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Icon } from 'react-native-elements';
import { SERVER_URL } from '../../utils/consts';
import { useNavigation } from '@react-navigation/native';
import { calendarTheme, useCalendarstyles } from './styles';
import TimelineItem from './TimelineItem';
import { primary } from '../../assets/colors';
import LoadingScreen from '../Loading/Loading';

const EventCalendarWithTimeline = ({ petId }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTimeline, setShowTimeline] = useState(true);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const styles = useCalendarstyles();
  const [colorsEvents, setColorsEvents] = useState([]);
  const [colors, setColors] = useState({});
  const [markedDates, setMarkedDates] = useState({});

  const getColorForEventType = (eventType) => {
    switch (eventType) {
      case 'doctor':
        return colors.doctor || '#000000'; 
      case 'medication':
        return colors.medication || '#000000';
      case 'vaccination':
        return colors.vaccination || '#000000';
      case 'custom':
        return colors.custom || '#000000';
    }
  };
  useEffect(() => {
    if (petId && selectedDate) {
      fetchEvents(petId, selectedDate, setEvents);
    }
  }, [petId, selectedDate]);

  useEffect(() => {
    fetchEventColors(petId);
  }, [petId]);

  useEffect(() => {
    const newMarkedDates = {};
    colorsEvents.forEach(colorsEvent => {
      const dateStr = colorsEvent.eventdate.split('T')[0];
      const eventType = colorsEvent.typeofevent;
      const color = getColorForEventType(eventType);

      if (!newMarkedDates[dateStr]) {
        newMarkedDates[dateStr] = { dots: [] };
      }

      if (!newMarkedDates[dateStr].dots.some(dot => dot.color === color)) {
        newMarkedDates[dateStr].dots.push({ key: eventType, color: color });
      }
    });

    newMarkedDates[selectedDate] = { selected: true, selectedColor: primary };
    setMarkedDates(newMarkedDates);
  }, [colorsEvents, selectedDate]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowTimeline(true);
  };


  const changeWeek = (amount) => {
    let currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + amount);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const getWeekDays = (selectedDate) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let currentDate = new Date(selectedDate);
    const currentDayOfWeek = currentDate.getDay();
    const offset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    currentDate.setDate(currentDate.getDate() + offset);

    let week = [];
    for (let i = 0; i < 7; i++) {
      let newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + i);
      week.push({
        dateStr: newDate.toISOString().split('T')[0],
        dayOfWeek: daysOfWeek[(newDate.getDay() === 0 ? 7 : newDate.getDay()) % 7]
      });
    }
    return week;
  };

  const renderWeekDays = () => {
    const weekDays = getWeekDays(selectedDate);
    return weekDays.map((day, index) => (
      <TouchableOpacity key={index} style={styles.dayItem} onPress={() => setSelectedDate(day.dateStr)}>
        {day.dateStr === selectedDate && <View style={styles.dot}></View>}
        <Text style={styles.dayOfWeekText}>{day.dayOfWeek}</Text>
        <Text style={styles.dayText}>{new Date(day.dateStr).getDate()}</Text>
      </TouchableOpacity>
    ));
  };

  const renderEvents = () => {
    const navigation = useNavigation();
    return events.map((event, index) => (
      <TimelineItem
        key={index}
        event={event}
        onEdit={() => navigation.navigate('EditEvent', { eventId: event.eventid })}
        onDelete={() => fetchEvents(petId, selectedDate, setEvents)}
      />
    ));
  };

  const fetchEvents = async (petId, selectedDate, setEvents) => {
    try {
      const formattedDate = selectedDate.split('T')[0];
      const response = await fetch(`${SERVER_URL}/events/${petId}/date/${formattedDate}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        throw new Error('Failed to fetch events for the specific date');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events for the specific date');
    }
  };

  const fetchEventsByMonth = async (petId, year, month, setColorsEvents) => {
    try {
      setLoadingMonth(true);
      const response = await fetch(`${SERVER_URL}/events/${petId}/${year}/${month}`);
      if (response.ok) {
        const data = await response.json();
        setColorsEvents(data);
      } else {
        throw new Error('Failed to fetch events for the specific month');
      }
    } catch (error) {
      console.error('Error fetching events by month:', error);
      Alert.alert('Error', 'Failed to fetch events for the specific month');
    } finally {
      setLoadingMonth(false);
    }
  };

  const fetchEventColors = async (petId) => {
    try {
      const response = await fetch(`${SERVER_URL}/pets/${petId}/eventColors`);
      if (response.ok) {
        const data = await response.json();
        setColors(data);
      } else {
        throw new Error('Failed to fetch event colors for the pet');
      }
    } catch (error) {
      console.error('Error fetching event colors:', error);
      Alert.alert('Error', 'Failed to fetch event colors for the pet');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!showTimeline ? (
       <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        firstDay={1}
        theme={calendarTheme}
        markingType={'multi-dot'}
        onMonthChange={(month) => {
          const year = month.year;
          const monthStr = (month.month < 10 ? '0' : '') + month.month;
          const newDate = `${year}-${monthStr}-01`;
          setSelectedDate(newDate);
          fetchEventsByMonth(petId, year, month.month, setColorsEvents);
        }}
      />
     
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <Icon name="chevron-left" onPress={() => changeWeek(-7)} />
            <TouchableOpacity onPress={() => {
              const year = selectedDate.split('-')[0];
              const month = selectedDate.split('-')[1];
              setLoadingMonth(true);
              fetchEventsByMonth(petId, year, month, setColorsEvents)
                .finally(() => setLoadingMonth(false));
              fetchEventColors(petId);
              setShowTimeline(false);
            }}>
              <Text>Open Calendar</Text>
            </TouchableOpacity>
            <Icon name="chevron-right" onPress={() => changeWeek(7)} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
            {renderWeekDays()}
          </View>
          <ScrollView style={{ flex: 1 }}>
            {loadingMonth ? <LoadingScreen /> : renderEvents()}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default EventCalendarWithTimeline;
