import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const user = {
    name: 'Dilara Yıldırım',
    email: 'dilara@example.com',
  };

  const favorites = [
    { id: 1, title: 'Mercimek Çorbası' },
    { id: 2, title: 'Tavuk Sote' },
    { id: 3, title: 'Karnıyarık' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Kullanıcı Bilgileri */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
          <Text style={styles.text}>Ad: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
        </View>

        {/* Favoriler */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Favori Tarifler</Text>

          {favorites.map((item) => (
            <View key={item.id} style={styles.favoriteItem}>
              <Text>{item.title}</Text>

              <TouchableOpacity>
                <Text style={styles.removeText}>Kaldır</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* İstatistikler */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>

          <Text style={styles.text}>
            Toplam Favori: {favorites.length}
          </Text>

          <Text style={styles.text}>
            Toplam Beğeni: 15
          </Text>

          <Text style={styles.text}>
            Planlanan Öğün: 8
          </Text>
        </View>

        {/* Haftalık Plan */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Haftalık Plan Özeti
          </Text>

          <Text style={styles.text}>
            Bu hafta 5 gün plan oluşturuldu.
          </Text>

          <Text style={styles.text}>
            Toplam 8 öğün planlandı.
          </Text>
        </View>

        {/* Tema */}
        <View style={styles.switchContainer}>
          <Text style={styles.sectionTitle}>
            Karanlık Tema
          </Text>

          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        {/* Bildirimler */}
        <View style={styles.switchContainer}>
          <Text style={styles.sectionTitle}>
            Bildirimler
          </Text>

          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>

        {/* Çıkış */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  text: {
    fontSize: 15,
    marginBottom: 4,
  },

  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  removeText: {
    color: 'red',
    fontWeight: '600',
  },

  switchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoutButton: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },

  logoutText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});