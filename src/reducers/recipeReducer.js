import { RECIPE_ACTIONS } from '../constants/actionTypes';

// Başlangıç State'imiz
export const initialRecipeState = {
  recipes: [],
  hasMore: true,
  isLoading: false,
  favorites: [],     // AsyncStorage'dan gelecek
  likedRecipes: [],  // AsyncStorage'dan gelecek
  commentCache: {},
  error: null,
};

export const recipeReducer = (state, action) => {
  switch (action.type) {
    case RECIPE_ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        favorites: action.payload.favorites || [],
        likedRecipes: action.payload.likedRecipes || [],
      };
    case RECIPE_ACTIONS.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case RECIPE_ACTIONS.LOAD_MORE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // Yeni gelen tarifleri mevcut listenin sonuna ekliyoruz
        recipes: [...state.recipes, ...action.payload.newRecipes],
        hasMore: action.payload.newRecipes.length === 12, // Dökümanda limit 12 olarak istenmiş
      };
    case RECIPE_ACTIONS.FETCH_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    case RECIPE_ACTIONS.LIKE_RECIPE:
      return {
        ...state,
        likedRecipes: [...state.likedRecipes, action.payload],
      };
    case RECIPE_ACTIONS.UNLIKE_RECIPE:
      return {
        ...state,
        likedRecipes: state.likedRecipes.filter(id => id !== action.payload),
      };
    case RECIPE_ACTIONS.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case RECIPE_ACTIONS.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };
    default:
      return state;
  }
};