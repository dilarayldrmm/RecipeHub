import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
// RecipeProvider import ediliyor
import { RecipeProvider } from './src/context/RecipeContext'; 

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* Tüm uygulama RecipeProvider ile sarmalanıyor */}
        <RecipeProvider> 
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </RecipeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}