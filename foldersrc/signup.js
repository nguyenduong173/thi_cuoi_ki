import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (name.trim().split(/\s+/).length < 2) {
      Alert.alert('Lỗi', 'Họ Tên phải có ít nhất 2 từ.');
      return;
    }
    if (!email.toLowerCase().startsWith('user')) {
      Alert.alert('Lỗi', "Email phải bắt đầu bằng chữ 'user' (VD: user123@gmail.com).");
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        email: email.toLowerCase(),
        password: password
      };

      await AsyncStorage.setItem('USER_ACCOUNT', JSON.stringify(userData));
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu.');
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
            <Text style={styles.heroTitle}>Create Account</Text>
            <Text style={styles.heroSubtitle}>Đăng ký để trải nghiệm mua sắm mượt mà và quản lý mọi đơn hàng.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign Up</Text>

            <TextInput
              style={styles.input}
              placeholder="Họ Tên"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#A8A8A8"
            />
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer} activeOpacity={0.8}>
              <Text style={styles.linkText}>
                Đã có tài khoản? <Text style={styles.linkHighlight}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#FFF6EB' },
  keyboardView: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 30 },
  heroTitle: { fontSize: 34, fontWeight: '900', color: '#4A3F35', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, lineHeight: 24, color: '#7F6D5C' },
  card: { backgroundColor: '#FFF', borderRadius: 28, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 6 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#2C1F1A', marginBottom: 20 },
  input: { backgroundColor: '#F8F2EA', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, color: '#2B1A34', marginBottom: 16 },
  button: { backgroundColor: '#5D3A4A', paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  linkContainer: { marginTop: 18, alignItems: 'center' },
  linkText: { color: '#7F5D3C', fontSize: 15, fontWeight: '700' },
  linkHighlight: { color: '#5D3A4A' }
});
