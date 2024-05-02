import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';

const EventCalendar = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const eventsForSectionList = [
    { title: "Upcoming Events", data: events.filter(e => new Date(e.eventdate) > new Date()) },
    { title: "Past Events", data: events.filter(e => new Date(e.eventdate) <= new Date()) },
  ];

  const filteredEvents = eventsForSectionList.map(section => ({
    ...section,
    data: section.data.filter(item =>
      (item.titleofevent && item.titleofevent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.typeofevent && item.typeofevent.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }));

  const getMarkedDates = () => {
    const markedDates = {};
    events.forEach(event => {
      const dateStr = new Date(event.eventdate).toISOString().split('T')[0];
      markedDates[dateStr] = { marked: true, dotColor: 'red', activeOpacity: 0.5 };
    });
    return markedDates;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchSection}>
        <Icon style={styles.searchIcon} name="search" size={20} color="#000"/>
        <TextInput
          style={styles.Searchinput}
          placeholder="Search"
          underlineColorAndroid="transparent"
          onChangeText={handleSearch}
        />
      </View>
      <Calendar
        current={Date.now()}
        markedDates={getMarkedDates()}
        onDayPress={(day) => {
          console.log('Selected day', day);
          const selectedDayEvents = events.filter(event =>
            new Date(event.eventdate).toISOString().split('T')[0] === day.dateString
          );
          console.log(selectedDayEvents);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  Searchinput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  }
});

export default EventCalendar;

