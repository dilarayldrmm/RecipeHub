import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Ekranların Import Edilmesi
import LoginScreen from '../screens/LoginScreen';
import FeedScreen from '../screens/FeedScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import CreateRecipeScreen from '../screens/CreateRecipeScreen';
import MealPlannerScreen from '../screens/MealPlannerScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Feed Stack: Kendi RecipeDetail kopyasını barındırır [cite: 26, 27]
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Tarifler' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Tarif Detayı' }} />
    </Stack.Navigator>
  );
}

// 2. Explore Stack 
function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ title: 'Keşfet' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Tarif Detayı' }} />
    </Stack.Navigator>
  );
}

// 3. Planner Stack 
function PlannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MealPlanner" component={MealPlannerScreen} options={{ title: 'Yemek Planlayıcı' }} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: 'Alışveriş Listesi' }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Tarif Detayı' }} />
    </Stack.Navigator>
  );
}

// 4. Profile Stack 
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profilim' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator (Alt Menü) 
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="FeedTab" component={FeedStack} options={{ title: 'Ana Sayfa' }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: 'Keşfet' }} />
      <Tab.Screen name="CreateRecipeTab" component={CreateRecipeScreen} options={{ title: 'Tarif Ekle' }} />
      <Tab.Screen name="PlannerTab" component={PlannerStack} options={{ title: 'Planlayıcı' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// Kök Navigatör: Giriş yapıldıysa MainTabs'e, yapılmadıysa Login'e yönlendirir [cite: 26, 29]
export default function AppNavigator() {
  // NOT: İlerleyen adımlarda AuthContext bağlandığında bu state oradan okunacak [cite: 14, 29]
  const isAuthenticated = false; 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}