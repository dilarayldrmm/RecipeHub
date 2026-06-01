import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeContext } from '../context/RecipeContext';
import { COLORS, SIZES } from '../constants/theme';

// Örnek Kategoriler
const CATEGORIES = ['Tümü', 'Kahvaltı', 'Akşam Yemeği', 'Tatlı', 'Atıştırmalık', 'Sağlıklı'];

export default function ExploreScreen({ navigation }) {
  const { recipes, isLoading } = useContext(RecipeContext);
  const [activeCategory, setActiveCategory] = useState('Tümü');

  // Listede gösterilecek tarifleri alıyoruz
  const recommendedRecipes = recipes.slice(0, 12);

  // Navigasyon İşlemi
  const handleNavigateDetail = (recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  };

  // Kategori Rozetleri Render Fonksiyonu
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryBadge,
        activeCategory === item && styles.categoryBadgeActive
      ]}
      onPress={() => setActiveCategory(item)}
    >
      <Text style={[
        styles.categoryText,
        activeCategory === item && styles.categoryTextActive
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  // Sizin İçin (Kompakt Kart) Render Fonksiyonu
  const renderRecommendedCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.recommendedCard}
      activeOpacity={0.8}
      onPress={() => handleNavigateDetail(item)}
    >
      <Image source={{ uri: item.image }} style={styles.recommendedImage} />
      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recommendedFooter}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.recommendedCalorie}>{item.caloriesPerServing} cal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Üst Başlık Alanı */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Keşfet</Text>
          <Text style={styles.subtitle}>Bugün ne pişirmek istersin?</Text>
        </View>

        {/* Kategoriler (Yatay Kaydırma) */}
        <View style={styles.section}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={renderCategory}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {isLoading && recipes.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Sizin İçin Önerilenler (İki Sütunlu Grid Hissi Veren Yapı) */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginLeft: SIZES.padding, marginBottom: 15 }]}>
                Sizin İçin Seçtiklerimiz
              </Text>
              
              <View style={styles.recommendedContainer}>
                {recommendedRecipes.map((item) => (
                  <View key={item.id} style={styles.recommendedWrapper}>
                    {renderRecommendedCard({ item })}
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  categoryList: {
    paddingHorizontal: SIZES.padding,
    gap: 10,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1E2126',
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  categoryBadgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  recommendedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    justifyContent: 'space-between',
  },
  recommendedWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  recommendedCard: {
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  recommendedCalorie: {
    color: COLORS.gray,
    fontSize: 12,
  }
});