import React, { useEffect, useContext, useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeContext } from '../context/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';
import { COLORS, SIZES } from '../constants/theme';

export default function FeedScreen({ navigation }) {
  const { 
    recipes, 
    isLoading, 
    hasMore, 
    loadMore, 
    likedRecipes, 
    favorites, 
    toggleLike, 
    toggleFavorite 
  } = useContext(RecipeContext);

  // Lokal State'ler
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all', 'easy', 'medium', 'hard' [cite: 30]

  // İlk yüklemede tarifleri çek
  useEffect(() => {
    if (recipes.length === 0) {
      loadMore(0);
    }
  }, []);

  // Arama için Debounce (300ms) [cite: 30]
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Pull-to-refresh işlemi [cite: 30]
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMore(0); // Listeyi sıfırlayıp baştan çeker
    setRefreshing(false);
  }, [loadMore]);

  // Infinite Scroll tetikleyicisi
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && recipes.length > 0) {
      loadMore(recipes.length); // skip değeri mevcut liste uzunluğu kadar artar 
    }
  }, [isLoading, hasMore, recipes.length, loadMore]);

  // Navigasyon İşlemi [cite: 30]
  const handleNavigateDetail = useCallback((recipe) => {
    navigation.navigate('RecipeDetail', { recipe });
  }, [navigation]);

  // ---------------------------------------------------------
  // ZORUNLU: useMemo ile Filtreleme ve Arama Hesaplamaları 
  // ---------------------------------------------------------
  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // 1. İsim bazlı arama (Client-side filtreleme)
    if (debouncedQuery) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    // 2. Zorluk derecesine göre filtreleme
    if (difficultyFilter !== 'all') {
      result = result.filter(r => 
        r.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    return result;
  }, [recipes, debouncedQuery, difficultyFilter]);


  // ---------------------------------------------------------
  // RENDER YARDIMCILARI
  // ---------------------------------------------------------
  
  // Döküman Zorunluluğu: getItemLayout ile O(1) kaydırma performansı 
  const getItemLayout = useCallback((data, index) => ({
    length: 240,
    offset: 240 * index,
    index,
  }), []);

  // Kart Render Fonksiyonu
  const renderRecipeItem = useCallback(({ item }) => (
    <RecipeCard 
      recipe={item}
      isLiked={likedRecipes.includes(item.id)}
      isFavorite={favorites.includes(item.id)}
      onPress={() => handleNavigateDetail(item)}
      onLike={() => toggleLike(item.id)}
      onFavorite={() => toggleFavorite(item.id)}
    />
  ), [likedRecipes, favorites, handleNavigateDetail, toggleLike, toggleFavorite]);

  // Filtreleme Butonları Bileşeni
  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      {['all', 'easy', 'medium', 'hard'].map(level => (
        <TouchableOpacity 
          key={level}
          style={[styles.filterBadge, difficultyFilter === level && styles.filterBadgeActive]}
          onPress={() => setDifficultyFilter(level)}
        >
          <Text style={[styles.filterText, difficultyFilter === level && styles.filterTextActive]}>
            {level.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Üst Arama Çubuğu */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tarif ara..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
        <FilterButtons />
      </View>

      {/* Liste Alanı */}
      {isLoading && recipes.length === 0 ? (
        // İlk Yükleme (Skeleton Shimmer) 
        <View style={styles.listPadding}>
          {[1, 2, 3, 4].map(key => <SkeletonCard key={key} />)}
        </View>
      ) : (
        // Performanslı FlatList
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          
          // DÖKÜMAN ZORUNLULUĞU: FlatList Tuning [cite: 29, 83]
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          initialNumToRender={8}
          windowSize={5}
          maxToRenderPerBatch={10}
          
          // Sonsuz Kaydırma 
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          
          // Çek-Yenile [cite: 30]
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={COLORS.primary}
            />
          }
          
          // Sayfa altı yükleme animasyonu
          ListFooterComponent={
            isLoading && hasMore && recipes.length > 0 ? (
              <ActivityIndicator style={{ marginVertical: 20 }} color={COLORS.primary} size="large" />
            ) : null
          }
          
          // Boş Durum
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={60} color={COLORS.gray} />
                <Text style={styles.emptyText}>Aradığınız kritere uygun tarif bulunamadı.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    padding: SIZES.padding,
    paddingTop: 60, // iOS Status bar boşluğu
    backgroundColor: '#1E2126',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    height: 46,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterBadgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.gray,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.backgroundLight,
  },
  listPadding: {
    padding: SIZES.padding,
    paddingBottom: 100, // Alt tab bar için boşluk
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: 16,
    fontSize: 15,
  }
});