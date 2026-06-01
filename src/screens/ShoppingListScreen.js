import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function ShoppingListScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: '#FFF' }}>Alışveriş Listesi Ekranı Yapım Aşamasında...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.backgroundDark, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});