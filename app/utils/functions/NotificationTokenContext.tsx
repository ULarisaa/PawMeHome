import React, { createContext, useContext, useState } from 'react';

const NotificationTokenContext = createContext({
  expoPushToken: null,
  setExpoPushToken: () => {}
});

export const useNotificationToken = () => useContext(NotificationTokenContext);

export const NotificationTokenProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);

  const value = {
    expoPushToken,
    setExpoPushToken
  };

  return (
    <NotificationTokenContext.Provider value={value}>
      {children}
    </NotificationTokenContext.Provider>
  );
};
