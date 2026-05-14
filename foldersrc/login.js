import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const storedAccountInfo = await AsyncStorage.getItem('USER_ACCOUNT');
      if (storedAccountInfo !== null) {
        const { email: storedEmail, password: storedPassword } = JSON.parse(storedAccountInfo);
        if (email.toLowerCase() === storedEmail && password === storedPassword) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } else {
          Alert.alert('Lỗi', 'Email hoặc mật khẩu không chính xác.');
        }
      } else {
        Alert.alert('Lỗi', 'Tài khoản không tồn tại. Vui lòng đăng ký.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Lỗi khi đọc dữ liệu.');
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.heroSubtitle}>Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng của bạn.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign In</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#A8A8A8"
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#A8A8A8"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToSignUp} style={styles.linkContainer} activeOpacity={0.8}>
              <Text style={styles.linkText}>
                Chưa có tài khoản? <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F3EBFF' },
  keyboardView: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 30 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#5D3A4A', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, lineHeight: 24, color: '#6E5F6F' },
  card: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 6 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#2B1A34', marginBottom: 20 },
  input: { backgroundColor: '#F4F0FF', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, color: '#2B1A34', marginBottom: 16 },
  button: { backgroundColor: '#7B5CC4', paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  linkContainer: { marginTop: 18, alignItems: 'center' },
  linkText: { color: '#7B5CC4', fontSize: 15, fontWeight: '700' },
  linkHighlight: { color: '#FF7F50' }
});
