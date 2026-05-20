import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SIZES } from '../constants/theme';

export default function SkeletonCard() {
  // Animasyon için başlangıç saydamlık değeri
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Dökümanda istenen zorunlu 800ms'lik Animated.loop 
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7, // Parlama anı
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3, // Sönme anı
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={styles.card}>
      {/* Resim Alanı */}
      <Animated.View style={[styles.imagePlaceholder, { opacity }]} />
      
      <View style={styles.contentContainer}>
        {/* Başlık ve Alt Başlık Alanları */}
        <Animated.View style={[styles.titlePlaceholder, { opacity }]} />
        <Animated.View style={[styles.subtitlePlaceholder, { opacity }]} />
        
        {/* Etiket (Zorluk, Süre) Alanları */}
        <View style={styles.row}>
          <Animated.View style={[styles.badgePlaceholder, { opacity }]} />
          <Animated.View style={[styles.badgePlaceholder, { opacity }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // Login ekranındaki premium koyu renklere uyumlu
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius * 1.2,
    marginBottom: SIZES.margin,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  imagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#2A2E35',
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  titlePlaceholder: {
    width: '75%',
    height: 22,
    backgroundColor: '#2A2E35',
    borderRadius: 6,
    marginBottom: 12,
  },
  subtitlePlaceholder: {
    width: '45%',
    height: 16,
    backgroundColor: '#2A2E35',
    borderRadius: 6,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  badgePlaceholder: {
    width: 70,
    height: 26,
    backgroundColor: '#2A2E35',
    borderRadius: 13,
  }
});