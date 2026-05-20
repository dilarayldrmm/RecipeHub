import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeContext } from '../context/RecipeContext';
import { COLORS, SIZES } from '../constants/theme';

export default function RecipeDetailScreen({ route, navigation }) {
  // Feed ekranından gönderilen tarif verisini alıyoruz
  const { recipe } = route.params;
  
  // Küresel beğeni/favori durumu için Context'e bağlanıyoruz
  const { likedRecipes, favorites, toggleLike, toggleFavorite } = useContext(RecipeContext);

  const isLiked = likedRecipes.includes(recipe.id);
  const isFavorite = favorites.includes(recipe.id);

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Büyük Kışkırtıcı Görsel Alanı */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          
          {/* Görsel Üzerindeki Karartma Katmanı (Yazıların okunması için) */}
          <View style={styles.imageOverlay} />

          {/* Üst Butonlar Barı */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.rightButtons}>
              <TouchableOpacity style={styles.circleButton} onPress={() => toggleFavorite(recipe.id)}>
                <Ionicons 
                  name={isFavorite ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={isFavorite ? COLORS.primary : "#FFF"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.circleButton} onPress={() => toggleLike(recipe.id)}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={22} 
                  color={isLiked ? COLORS.error : "#FFF"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Görsel Üstü Başlık Alanı */}
          <View style={styles.titleContainer}>
            <Text style={styles.cuisineTag}>{recipe.cuisine} Mutfağı</Text>
            <Text style={styles.mainTitle}>{recipe.name}</Text>
          </View>
        </View>

        {/* Tarif Özet Bilgi Kartları */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoValue}>{totalTime} dk</Text>
            <Text style={styles.infoLabel}>Toplam Süre</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="flame-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoValue}>{recipe.caloriesPerServing}</Text>
            <Text style={styles.infoLabel}>Kalori (Porsiyon)</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoValue}>{recipe.servings}</Text>
            <Text style={styles.infoLabel}>Kişilik</Text>
          </View>
        </View>

        {/* Malzemeler (Ingredients) Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerekli Malzemeler</Text>
          <View style={styles.cardContainer}>
            {recipe.ingredients?.map((ingredient, index) => (
              <View key={index} style={styles.bulletRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.bulletText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Hazırlanışı (Instructions) Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazırlanışı</Text>
          {recipe.instructions?.map((instruction, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{instruction}</Text>
            </View>
          ))}
        </View>
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
  imageContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: SIZES.padding,
    right: SIZES.padding,
    zIndex: 10,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 25,
    left: SIZES.padding,
    right: SIZES.padding,
  },
  cuisineTag: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 36,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginTop: -30, // Kartları görselin üzerine hafif taşır (Premium tasarım tekniği)
    zIndex: 20,
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2E35',
    // Gölge efekti
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  infoLabel: {
    color: COLORS.gray,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: SIZES.padding,
    marginTop: 35,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  cardContainer: {
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  bulletText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 14,
  },
  stepNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 99, 71, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 99, 71, 0.3)',
    marginTop: 2, // Yazıyla hizala
  },
  stepNumberText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
});