import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Làm trong suốt thanh trạng thái (giờ, pin) để ảnh tràn lên tận cùng mép trên */}
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Hero Image - Nửa trên màn hình */}
      <Image
        source={require('../assets/onboard.png')}
        style={styles.heroImage}
      />

      {/* Content Area - Nửa dưới màn hình */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Welcome to{'\n'}coloshop
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Màu nền sáng ở phần chữ
  },
  heroImage: {
    width: '100%',
    height: '60%', // Chiếm 60% chiều cao màn hình
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1, // Chiếm 40% còn lại
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, // Chừa khoảng trống cho thanh home ảo iOS
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
    // Chữ trong thiết kế dùng font uốn lượn đặc biệt. 
    // Tạm thời dùng italic để tạo điểm nhấn, bạn nhớ add font thật vào nhé.
    fontStyle: 'italic', 
    lineHeight: 48,
  },
  button: {
    width: '100%',
    backgroundColor: '#5D3A4A', // Màu đỏ/nâu Maroon đồng nhất với toàn bộ app
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Font chữ có chân cho giống nút bấm
  },
});