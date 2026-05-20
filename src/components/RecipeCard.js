import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

// Bileşeni oluşturuyoruz
const RecipeCard = ({ recipe, isLiked, isFavorite, onPress, onLike, onFavorite }) => {
  // Toplam süreyi hesapla (prepTimeMinutes + cookTimeMinutes)
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Zorluk derecesine göre rozet rengi belirleme
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#34C759'; // Yeşil
      case 'medium': return '#FF9500'; // Turuncu
      case 'hard': return '#FF3B30'; // Kırmızı
      default: return COLORS.gray;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Kapak Görseli */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {/* Sağ Üst - Favori İkonu (Optimistik UI) */}
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
          <Ionicons 
            name={isFavorite ? "bookmark" : "bookmark-outline"} 
            size={22} 
            color={isFavorite ? COLORS.primary : COLORS.textDark} 
          />
        </TouchableOpacity>

        {/* Sol Alt - Zorluk Rozeti */}
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>

      {/* Kart İçeriği */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{recipe.name}</Text>
        </View>
        <Text style={styles.cuisine}>{recipe.cuisine} Cuisine</Text>
        
        <View style={styles.footer}>
          {/* Süre */}
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={COLORS.gray} />
            <Text style={styles.infoText}>{totalTime} min</Text>
          </View>

          {/* Kalori */}
          <View style={styles.infoItem}>
            <Ionicons name="flame-outline" size={16} color={COLORS.gray} />
            <Text style={styles.infoText}>{recipe.caloriesPerServing} cal</Text>
          </View>

          {/* Beğeni (Like) Butonu - Optimistik UI */}
          <TouchableOpacity style={styles.likeButton} onPress={onLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? COLORS.error : COLORS.gray} 
            />
            {/* Sahte bir beğeni sayısı gösteriyoruz (DummyJSON'da genelde rating var, biz reviewCount kullanıyoruz) */}
            <Text style={[styles.infoText, { color: isLiked ? COLORS.error : COLORS.gray, marginLeft: 4 }]}>
              {recipe.reviewCount + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// DÖKÜMAN ZORUNLULUĞU: Gereksiz render'ları önlemek için React.memo ile sarıyoruz
export default React.memo(RecipeCard, (prevProps, nextProps) => {
  // Sadece bu proplar değiştiğinde kart yeniden çizilir (Performans Optimizasyonu)
  return (
    prevProps.recipe.id === nextProps.recipe.id &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isFavorite === nextProps.isFavorite
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius * 1.5,
    marginBottom: SIZES.margin,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Hafif gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  cuisine: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: COLORS.gray,
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  }
});