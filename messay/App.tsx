/**
 * App.tsx
 * ---------------------------------
 * Point d'entrée principal de l'application Messay.
 * Affiche messay-logo-1.png au chargement, puis la navigation.
 */

import React, { useState, useCallback } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import { store } from './src/store';
import RootNavigator from './src/navigation/routes';
import SplashScreen from './src/components/splash/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return (
      <SplashScreen onFinish={handleSplashFinish} />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
