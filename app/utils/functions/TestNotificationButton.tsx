import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { SERVER_URL } from '../consts';

async function sendTestNotification(token, setFeedback) {
  try {
    console.log(token);
    const response = await fetch(`${SERVER_URL}/pushNotifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        message: "This is a test notification from the app!",
      }),
    });

    if (response.ok) {
      setFeedback("Notification sent successfully!");
    } else {
      throw new Error('Failed to send notification due to server error');
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
    setFeedback(error.message);
  }
}

function TestNotificationButton({ token }) {
  const [feedback, setFeedback] = useState('');
console.log(token);
  return (
    <View style={styles.container}>
      <Button title="Send Test Notification" onPress={() => sendTestNotification(token, setFeedback)} />
      {feedback ? <Text>{feedback}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default TestNotificationButton;
