import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
// RecipeProvider import ediliyor
import { RecipeProvider } from './src/context/RecipeContext'; 
import { PlannerProvider } from './src/context/PlannerContext';

export default function App() {
  return (
   <AuthProvider>
  <RecipeProvider>
    <PlannerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PlannerProvider>
  </RecipeProvider>
</AuthProvider>
  );
}