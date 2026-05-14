import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Tự động chuyển đến màn hình Onboarding sau 2 giây
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Ẩn thanh trạng thái (giờ, pin...) để màn hình Splash tràn viền tuyệt đối */}
      <StatusBar hidden={true} />
      
      <Text style={styles.logoText}>COLOSHOP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D3A4A", // Màu đỏ/nâu nền đặc trưng của app
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    letterSpacing: 5.5,
    color: "#FFFFFF",
    fontWeight: "bold",
    // Thêm fontFamily: 'Inter' nếu bạn đã cài font này vào dự án
  },
});