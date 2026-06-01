import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PlannerContext = createContext();

const STORAGE_KEY = '@meal_planner_data';

export const PlannerProvider = ({ children }) => {
  const [weeklyPlan, setWeeklyPlan] = useState({});

  // 1. Uygulama açıldığında AsyncStorage'dan kayıtlı planı yükle
  useEffect(() => {
    const loadPlan = async () => {
      try {
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedPlan) {
          setWeeklyPlan(JSON.parse(storedPlan));
        }
      } catch (error) {
        console.error('Plan yükleme hatası:', error);
      }
    };
    loadPlan();
  }, []);

  // 2. Belirli bir güne ve öğüne tarif ekle
  const addToDay = useCallback((day, mealType, recipe) => {
    setWeeklyPlan((prev) => {
      const dayPlan = prev[day] || {};
      const newPlan = {
        ...prev,
        [day]: {
          ...dayPlan,
          [mealType]: recipe
        }
      };
      // State sorunsuz güncellenirken arkada sessizce telefona da kaydet
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan)).catch(console.error);
      return newPlan;
    });
  }, []);

  // 3. Belirli bir öğünden tarifi çıkar (Sola kaydırıp silme)
  const removeFromDay = useCallback((day, mealType) => {
    setWeeklyPlan((prev) => {
      if (!prev[day]) return prev;
      const newPlan = {
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: null
        }
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan)).catch(console.error);
      return newPlan;
    });
  }, []);

  // 4. Bütün bir günün öğünlerini temizle
  const clearDay = useCallback((day) => {
    setWeeklyPlan((prev) => {
      const newPlan = {
        ...prev,
        [day]: { Sabah: null, Öğle: null, Akşam: null }
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan)).catch(console.error);
      return newPlan;
    });
  }, []);

  // 5. Bütün haftayı sıfırla
  const clearWeek = useCallback(() => {
    setWeeklyPlan({});
    AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
  }, []);

  return (
    <PlannerContext.Provider value={{ 
      weeklyPlan, 
      addToDay, 
      removeFromDay, 
      clearDay, 
      clearWeek 
    }}>
      {children}
    </PlannerContext.Provider>
  );
};