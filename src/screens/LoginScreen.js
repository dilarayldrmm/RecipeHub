import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
// Yeni importumuz: Renk geçişi için
import { LinearGradient } from 'expo-linear-gradient'; 
import { Ionicons } from '@expo/vector-icons'; 
import { AuthContext } from '../context/AuthContext';
import { COLORS, SIZES } from '../constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, authState } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setValidationError('Tüm alanları doldurmanız gerekiyor.');
      return;
    }
    
    setValidationError('');
    setLoading(true);

    await login(username, password);

    if (authState.error) {
       setLoading(false);
    }
  };

  const displayError = validationError || authState.error;

  return (
    // TÜM EKRANI KAPLAYAN GRADYAN ARKA PLAN
    <LinearGradient
      // Renkler: Çok koyu lacivert/siyah -> Tema renginin (turuncu) çok koyu asil bir tonu
      colors={['#0F1115', '#1A1D21', 'rgba(255, 99, 71, 0.15)']}
      // Başlangıç noktası: Sol üst köşe [0, 0]
      start={{ x: 0, y: 0 }}
      // Bitiş noktası: Sağ alt köşe [1, 1]
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={35} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Recipe<Text style={{color: COLORS.primary}}>Hub</Text></Text>
            <Text style={styles.subtitle}>En lezzetli tarifler ve yemek planınız sizi bekliyor.</Text>
          </View>

          <View style={styles.form}>
            {/* Kullanıcı Adı */}
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı adınızı girin"
                placeholderTextColor={COLORS.gray}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setValidationError('');
                }}
                autoCapitalize="none"
              />
            </View>

            {/* Şifre */}
            <Text style={styles.label}>Şifre</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifrenizi girin"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setValidationError('');
                }}
                secureTextEntry 
              />
            </View>

            {/* Hata Mesajı */}
            {displayError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* Giriş Butonu */}
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.backgroundLight} />
              ) : (
                <>
                  <Text style={styles.buttonText}>Güvenli Giriş</Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.backgroundLight} style={{marginLeft: 10}} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi unuttum?</Text>
            </TouchableOpacity>
          </View>

          {/* Alt Kısım */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabınız yok mu? </Text>
            <TouchableOpacity>
              <Text style={styles.signupText}>Hemen Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'space-between', // İçeriği yukarı ve aşağı yay
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 70 : 50,
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Çok hafif parlama
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textDark,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 25,
    lineHeight: 22,
    fontWeight: '400',
  },
  form: {
    flex: 1,
    justifyContent: 'center', // Formu dikeyde ortala
    marginBottom: 30,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.9)', // Tam beyaz değil, hafif saydam
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Inputların içi biraz daha koyu cam efekti
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    borderRadius: SIZES.radius * 1.5,
    paddingHorizontal: 18,
    marginBottom: 20,
    height: 60, // Premium hissi için daha yüksek input
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 16,
    height: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    padding: 16,
    borderRadius: SIZES.radius * 1.2,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.4)',
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    flex: 1, // Uzun hatalarda yazıyı alt satıra kaydır
  },
  button: {
    backgroundColor: COLORS.primary, // Canlı turuncu buton
    flexDirection: 'row',
    height: 60, // Buton da premium yükseklikte
    borderRadius: SIZES.radius * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    // Gölge efekti
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 99, 71, 0.5)',
  },
  buttonText: {
    color: COLORS.backgroundLight,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 25,
  },
  forgotPasswordText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)', // Sönük beyaz
    fontSize: 14,
  },
  signupText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});