import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ColorSchemeContext = createContext();

export const useColorScheme = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({ children }) => {
  const systemScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState(systemScheme);

  useEffect(() => {
    setColorScheme(systemScheme);
  }, [systemScheme]);

  return (
    <ColorSchemeContext.Provider value={colorScheme}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
