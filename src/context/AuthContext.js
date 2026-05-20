import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer, initialAuthState } from '../reducers/authReducer';
import { AUTH_ACTIONS } from '../constants/actionTypes';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Uygulama ilk açıldığında AsyncStorage'dan token'ı okuma işlemi
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let userData;
      try {
        userToken = await AsyncStorage.getItem('@auth_token');
        const userJson = await AsyncStorage.getItem('@auth_user');
        userData = userJson ? JSON.parse(userJson) : null;
      } catch (e) {
        console.error("Token okuma hatası:", e);
      }
      
      // State'i güncelle ve loading ekranını bitir
      dispatch({ 
        type: 'RESTORE_TOKEN', 
        payload: { token: userToken, user: userData } 
      });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      login: async (username, password) => {
        try {
          // Boşlukları temizleyerek (trim) API'ye gönderiyoruz
          const cleanUsername = username.trim();
          const cleanPassword = password.trim();

          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: cleanUsername,
              password: cleanPassword,
            })
          });

          const data = await response.json();

          if (response.ok) {
            // API'nin eski veya yeni versiyon (accessToken) dönme ihtimaline karşı ikisini de yakalıyoruz
            const validToken = data.accessToken || data.token;
            
            await AsyncStorage.setItem('@auth_token', validToken);
            await AsyncStorage.setItem('@auth_user', JSON.stringify(data));
            
            dispatch({ 
              type: AUTH_ACTIONS.LOGIN_SUCCESS, 
              payload: { token: validToken, user: data } 
            });
          } else {
            // API'den dönen özel hata (Örn: Invalid credentials)
            dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: data.message });
          }
        } catch (error) {
          // Gerçek hatayı VS Code terminalinde görmek için logluyoruz
          console.error("GIRIŞ API HATASI DETAYI:", error);
          dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: 'Bir ağ hatası oluştu. Lütfen internetinizi kontrol edin.' });
        }
      },
      logout: async () => {
        try {
          // AsyncStorage.multiRemove kullanımı çıkış için en sağlıklısıdır
          await AsyncStorage.multiRemove([
            '@auth_token', 
            '@auth_user',
            '@recipe_favorites',
            '@recipe_liked',
            '@planner_weekly'
          ]);
        } catch (e) {
          console.error("Çıkış yaparken storage temizleme hatası:", e);
        }
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      },
      authState: state,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};