import React, {useState} from 'react';
import {View, TextInput, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerField = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
      <TextInput
        value={date.toLocaleDateString()}
        onFocus={showDatepicker}
        editable={false} // Previne tastatura să apară
      />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerField;
