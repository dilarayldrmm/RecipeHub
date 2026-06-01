import React, { useContext, useState, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
  Platform,
  Image
} from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

// Varsayımsal Context'ler (Dilan'ın bunları oluşturduğu/oluşturacağı varsayılmıştır)
import { PlannerContext } from '../context/PlannerContext';
import { RecipeContext } from '../context/RecipeContext';

const DAYS_OF_WEEK = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const MEAL_TYPES = ['Sabah', 'Öğle', 'Akşam'];

// ---------------------------------------------------------
// ZORUNLULUK: React.memo ile Optimize Edilmiş MealSlot Componenti
// ---------------------------------------------------------
const MealSlot = memo(({ day, mealType, recipe, onRemove, onAdd }) => {
  const heightAnim = useRef(new Animated.Value(80)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Animasyonlu Silme İşlemi
  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(heightAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: false })
    ]).start(() => {
      onRemove(day, mealType);
      // Silindikten sonra slot tekrar boş hale geleceği için animasyonları sıfırlıyoruz
      heightAnim.setValue(80);
      opacityAnim.setValue(1);
    });
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
      <Ionicons name="trash-outline" size={24} color="#FFF" />
      <Text style={styles.deleteActionText}>Sil</Text>
    </TouchableOpacity>
  );

  if (recipe) {
    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Animated.View style={[styles.filledSlot, { height: heightAnim, opacity: opacityAnim }]}>
          <Image source={{ uri: recipe.image }} style={styles.slotImage} />
          <View style={styles.slotInfo}>
            <Text style={styles.slotMealType}>{mealType}</Text>
            <Text style={styles.slotRecipeName} numberOfLines={1}>{recipe.name}</Text>
          </View>
        </Animated.View>
      </Swipeable>
    );
  }

  // Boş Durum (Ekle Butonu)
  return (
    <TouchableOpacity style={styles.emptySlot} onPress={() => onAdd(day, mealType)}>
      <Ionicons name="add-circle-outline" size={20} color={COLORS.gray} />
      <Text style={styles.emptySlotText}>{mealType} için tarif ekle</Text>
    </TouchableOpacity>
  );
});


// ---------------------------------------------------------
// ANA EKRAN COMPONENTİ
// ---------------------------------------------------------
export default function MealPlannerScreen({ navigation }) {
  // Veriler tamamen Context'ten okunuyor (Local state'te plan tutulmuyor!)
  const { weeklyPlan, addToDay, removeFromDay, clearDay, clearWeek } = useContext(PlannerContext) || { weeklyPlan: {} }; 
  const { recipes, favorites } = useContext(RecipeContext) || { recipes: [], favorites: [] };

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ day: null, mealType: null });
  const [searchQuery, setSearchQuery] = useState('');

  // Sadece favori tarifleri filtreliyoruz (veya tümünden arama)
  const availableRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ZORUNLULUK: onAdd ve onRemove useCallback ile sarılmalı
  const handleRemoveFromDay = useCallback((day, mealType) => {
    if(removeFromDay) removeFromDay(day, mealType);
  }, [removeFromDay]);

  const handleOpenPicker = useCallback((day, mealType) => {
    setSelectedSlot({ day, mealType });
    setModalVisible(true);
  }, []);

  const handleSelectRecipe = (recipe) => {
    if(addToDay) addToDay(selectedSlot.day, selectedSlot.mealType, recipe);
    setModalVisible(false);
    setSearchQuery('');
  };

  // Planın tamamen boş olup olmadığını kontrol et
  const isPlanEmpty = !weeklyPlan || Object.keys(weeklyPlan).length === 0 || 
    Object.values(weeklyPlan).every(day => !day || Object.values(day).every(meal => meal === null));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Üst Header ve Aksiyon Butonları */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Haftalık Plan</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => { if(clearWeek) clearWeek(); }} style={styles.iconButton}>
              <Ionicons name="refresh" size={20} color={COLORS.primary} />
              <Text style={styles.iconButtonText}>Sıfırla</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('ShoppingList')} style={styles.iconButton}>
              <Ionicons name="cart" size={20} color={COLORS.primary} />
              <Text style={styles.iconButtonText}>Alışveriş</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ZORUNLULUK: Boş Durum Gösterimi */}
        {isPlanEmpty && (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyStateText}>Henüz tarif eklemediniz — keşfetmeye başlayın!</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('ExploreTab')}>
              <Text style={styles.exploreButtonText}>Tarif Keşfet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Günlerin Listelenmesi */}
        {DAYS_OF_WEEK.map((day) => {
          const dayPlan = weeklyPlan?.[day] || {};
          
          return (
            <View key={day} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <TouchableOpacity onPress={() => { if(clearDay) clearDay(day); }}>
                  <Text style={styles.clearDayText}>Günü Temizle</Text>
                </TouchableOpacity>
              </View>
              
              {MEAL_TYPES.map((mealType) => (
                <MealSlot
                  key={`${day}-${mealType}`}
                  day={day}
                  mealType={mealType}
                  recipe={dayPlan[mealType]}
                  onRemove={handleRemoveFromDay}
                  onAdd={handleOpenPicker}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* ZORUNLULUK: RecipePicker Modal */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tarif Seç</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={availableRecipes}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalRecipeCard} onPress={() => handleSelectRecipe(item)}>
                <Image source={{ uri: item.image }} style={styles.modalRecipeImage} />
                <Text style={styles.modalRecipeName}>{item.name}</Text>
                {favorites.includes(item.id) && <Ionicons name="heart" size={16} color={COLORS.error} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: '#1E2126',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconButtonText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: SIZES.radius,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: COLORS.gray,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 14,
  },
  exploreButton: {
    marginTop: 15,
    backgroundColor: 'rgba(255, 99, 71, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dayCard: {
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  clearDayText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    color: COLORS.gray,
    marginLeft: 10,
    fontSize: 14,
  },
  filledSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2E35',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  slotImage: {
    width: 80,
    height: 80,
  },
  slotInfo: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  slotMealType: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  slotRecipeName: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  deleteActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2E35',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  modalList: {
    padding: SIZES.padding,
  },
  modalRecipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2126',
    padding: 10,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  modalRecipeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  modalRecipeName: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '600',
  },
});