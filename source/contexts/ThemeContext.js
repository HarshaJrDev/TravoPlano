import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF',
  primary: '#6200EE',
  text: '#000000',
  cardBackground: '#F5F5F5',
  headerBackground: '#6200EE',
  inputBackground: '#FFFFFF',
  chipBackground: '#E0E0E0',
  modalBackground: '#FFFFFF',
  placeholder: '#9E9E9E',
  textSecondary: '#616161',
  buttonCancelBackground: '#B00020',
  iconBackground: 'rgba(98,0,238,0.1)',
  chipText: '#000000',
};

const darkTheme = {
  background: '#121212',
  primary: '#BB86FC',
  text: '#FFFFFF',
  cardBackground: '#1E1E1E',
  headerBackground: '#3700B3',
  inputBackground: '#2D2D2D',
  chipBackground: '#383838',
  modalBackground: '#2D2D2D',
  placeholder: '#757575',
  textSecondary: '#BDBDBD',
  buttonCancelBackground: '#CF6679',
  iconBackground: 'rgba(187,134,252,0.1)',
  chipText: '#FFFFFF',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleTheme,
      theme: isDarkMode ? darkTheme : lightTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};