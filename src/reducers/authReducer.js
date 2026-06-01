import { AUTH_ACTIONS } from '../constants/actionTypes';

// Başlangıç state'imiz
export const initialAuthState = {
  isLoading: true, // Uygulama açılırken AsyncStorage kontrolü için bekletme durumu
  isSignout: false,
  userToken: null,
  user: null,
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.payload.token,
        user: action.payload.user,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isSignout: false,
        userToken: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isSignout: true,
        userToken: null,
        user: null,
      };
    default:
      return state;
  }
};