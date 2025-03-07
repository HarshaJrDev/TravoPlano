import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '././source/contexts/ThemeContext'; // Import ThemeProvider
import HomeScreen from '././source/Screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
          <ThemeProvider>
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    </ThemeProvider>

    </GestureHandlerRootView>

  );
};

export default App;
