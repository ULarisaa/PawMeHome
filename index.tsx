import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { NotificationTokenProvider } from './app/utils/functions/NotificationTokenContext'; // Ajustează calea la locația corectă
import { name as appName } from './app.json';

const Root = () => (
  <NotificationTokenProvider>
    <App />
  </NotificationTokenProvider>
);

AppRegistry.registerComponent(appName, () => Root);
