import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Galeri paketi eklendi
import { COLORS, SIZES } from '../constants/theme';

export default function CreateRecipeScreen({ navigation }) {
  // Form State'leri
  const [recipeName, setRecipeName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null); // Seçilen fotoğrafın URI'sini tutacak

  // Galeriden Fotoğraf Seçme Fonksiyonu
  const pickImage = async () => {
    // Kullanıcıdan galeri izni istiyoruz (iOS ve Android için standart güvenlik)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Fotoğraf seçebilmek için galeri erişim izni vermeniz gerekiyor.");
      return;
    }

    // Galeriyi aç
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Sadece fotoğraflar
      allowsEditing: true, // Kullanıcı fotoğrafı kırpabilsin
      aspect: [16, 9], // Geniş tarif kapağı formatı
      quality: 0.8, // Optimizasyon için kaliteyi biraz düşürüyoruz
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Seçilen fotoğrafı state'e kaydet
    }
  };

  // Form Gönderme İşlemi
  const handleSubmit = () => {
    if (!recipeName || !cuisine || !prepTime || !ingredients || !instructions) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);

    // API Simülasyonu
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Başarılı!',
        'Tarifiniz başarıyla eklendi.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Tarif Ekle</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* GERÇEK GÖRSEL YÜKLEME ALANI */}
        <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
          {imageUri ? (
            // Eğer fotoğraf seçildiyse fotoğrafı göster ve üzerine değiştirme butonu koy
            <View style={styles.uploadedImageContainer}>
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              <View style={styles.editImageOverlay}>
                <Ionicons name="pencil" size={20} color="#FFF" />
                <Text style={styles.editImageText}>Değiştir</Text>
              </View>
            </View>
          ) : (
            // Fotoğraf yoksa varsayılan boş kutuyu göster
            <>
              <Ionicons name="images-outline" size={40} color={COLORS.gray} />
              <Text style={styles.imageUploadText}>Kapak Görseli Seç</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tarif Adı */}
        <Text style={styles.label}>Tarif Adı</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="restaurant-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Örn: Fırında Somon"
            placeholderTextColor={COLORS.gray}
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        <View style={styles.row}>
          {/* Mutfak Türü */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Mutfak Türü</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="earth-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Örn: Akdeniz"
                placeholderTextColor={COLORS.gray}
                value={cuisine}
                onChangeText={setCuisine}
              />
            </View>
          </View>

          {/* Süre */}
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>Süre (Dk)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Örn: 45"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>
          </View>
        </View>

        {/* Zorluk Derecesi Seçici */}
        <Text style={styles.label}>Zorluk Derecesi</Text>
        <View style={styles.difficultyContainer}>
          {['Easy', 'Medium', 'Hard'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.difficultyButtonActive
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text style={[
                styles.difficultyText,
                difficulty === level && styles.difficultyTextActive
              ]}>
                {level === 'Easy' ? 'Kolay' : level === 'Medium' ? 'Orta' : 'Zor'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Malzemeler */}
        <Text style={styles.label}>Malzemeler</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Her satıra bir malzeme yazın..."
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={4}
            value={ingredients}
            onChangeText={setIngredients}
            textAlignVertical="top"
          />
        </View>

        {/* Hazırlanışı */}
        <Text style={styles.label}>Hazırlanışı</Text>
        <View style={[styles.inputContainer, styles.textAreaContainer]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Adım adım yapılışını anlatın..."
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={5}
            value={instructions}
            onChangeText={setInstructions}
            textAlignVertical="top"
          />
        </View>

        {/* Gönder Butonu */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.backgroundLight} />
          ) : (
            <Text style={styles.submitButtonText}>Tarifi Paylaş</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#1E2126',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  imageUploadBox: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    overflow: 'hidden', // Fotoğraf taşmasın diye
  },
  uploadedImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editImageText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  imageUploadText: {
    color: COLORS.gray,
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2126',
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 56,
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 15,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    height: 46,
    borderRadius: SIZES.radius,
    backgroundColor: '#1E2126',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  difficultyButtonActive: {
    backgroundColor: 'rgba(255, 99, 71, 0.15)',
    borderColor: COLORS.primary,
  },
  difficultyText: {
    color: COLORS.gray,
    fontWeight: '600',
  },
  difficultyTextActive: {
    color: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255, 99, 71, 0.5)',
  },
  submitButtonText: {
    color: COLORS.backgroundLight,
    fontSize: 16,
    fontWeight: 'bold',
  }
});