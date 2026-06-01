import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipeReducer, initialRecipeState } from '../reducers/recipeReducer';
import { RECIPE_ACTIONS } from '../constants/actionTypes';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialRecipeState);

  // 1. Uygulama açılışında AsyncStorage'dan favori ve beğenileri yükleme
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const favsJson = await AsyncStorage.getItem('@recipe_favorites');
        const likesJson = await AsyncStorage.getItem('@recipe_liked');

        dispatch({
          type: RECIPE_ACTIONS.LOAD_FROM_STORAGE,
          payload: {
            favorites: favsJson ? JSON.parse(favsJson) : [],
            likedRecipes: likesJson ? JSON.parse(likesJson) : [],
          }
        });
      } catch (error) {
        console.error('Storage okuma hatası:', error);
      }
    };
    loadPersistedData();
  }, []);

  // AsyncStorage Güncelleme Yardımcı Fonksiyonu
  const updateStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`${key} kaydetme hatası:`, error);
    }
  };

  // 2. Tarifleri Getirme (Infinite Scroll için useCallback ile optimize edildi)
  const loadMore = useCallback(async (skip = 0) => {
    if (!state.hasMore && skip !== 0) return;

    dispatch({ type: RECIPE_ACTIONS.FETCH_START });
    try {
      // DummyJSON limit=12 endpoint'i kullanılıyor
      const response = await fetch(`https://dummyjson.com/recipes?limit=12&skip=${skip}`);
      const data = await response.json();

      dispatch({
        type: RECIPE_ACTIONS.LOAD_MORE_SUCCESS,
        payload: { newRecipes: data.recipes }
      });
    } catch (error) {
      dispatch({ type: RECIPE_ACTIONS.FETCH_FAILURE, payload: 'Tarifler yüklenemedi.' });
    }
  }, [state.hasMore]);

  // 3. Optimistik Favori Ekleme/Çıkarma
  const toggleFavorite = useCallback((recipeId) => {
    const isFav = state.favorites.includes(recipeId);
    const newFavorites = isFav
      ? state.favorites.filter(id => id !== recipeId)
      : [...state.favorites, recipeId];

    // Anında UI Güncellemesi
    dispatch({
      type: isFav ? RECIPE_ACTIONS.REMOVE_FAVORITE : RECIPE_ACTIONS.ADD_FAVORITE,
      payload: recipeId
    });

    // Arkada AsyncStorage'a yazma
    updateStorage('@recipe_favorites', newFavorites);
  }, [state.favorites]);

  // 4. Optimistik Beğeni Ekleme/Çıkarma
  const toggleLike = useCallback((recipeId) => {
    const isLiked = state.likedRecipes.includes(recipeId);
    const newLikes = isLiked
      ? state.likedRecipes.filter(id => id !== recipeId)
      : [...state.likedRecipes, recipeId];

    // Anında UI Güncellemesi
    dispatch({
      type: isLiked ? RECIPE_ACTIONS.UNLIKE_RECIPE : RECIPE_ACTIONS.LIKE_RECIPE,
      payload: recipeId
    });

    // Arkada AsyncStorage'a yazma
    updateStorage('@recipe_liked', newLikes);
  }, [state.likedRecipes]);

  // 5. Manuel Tarif Ekleme (Create Recipe ekranından gelen veriyi local state'e yazar)
  const addRecipe = useCallback((newRecipeData) => {
    // FlatList'in çökmemesi için sahte bir ID ve eksik verileri dolduruyoruz
    const recipeWithMockData = {
      ...newRecipeData,
      id: Math.floor(Math.random() * 10000) + 1000, // Sahte benzersiz ID
      reviewCount: 0,
      caloriesPerServing: Math.floor(Math.random() * 400) + 200, // Rastgele kalori
    };

    dispatch({ type: 'ADD_RECIPE', payload: recipeWithMockData });
  }, []);

  return (
    <RecipeContext.Provider value={{
      ...state,
      loadMore,
      toggleFavorite,
      toggleLike,
      addRecipe // Yeni fonksiyonu diğer ekranların kullanabilmesi için dışarı aktarıyoruz
    }}>
      {children}
    </RecipeContext.Provider>
  );
};