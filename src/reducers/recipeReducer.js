import { RECIPE_ACTIONS } from '../constants/actionTypes';

export const initialRecipeState = {
  recipes: [],
  hasMore: true,
  isLoading: false,
  favorites: [],
  likedRecipes: [],
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
        recipes: [...state.recipes, ...action.payload.newRecipes],
        hasMore: action.payload.newRecipes.length === 12,
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
    // YENİ EKLENEN KISIM: Yeni tarifi listenin en başına ekler
    case 'ADD_RECIPE':
      return {
        ...state,
        recipes: [action.payload, ...state.recipes], 
      };
    default:
      return state;
  }
};