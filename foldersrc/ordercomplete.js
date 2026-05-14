import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function OrderAcceptedScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Success Icon Area */}
        <View style={styles.iconContainer}>
          {/* Mẹo: Để có các họa tiết dây ruy-băng xoắn và chấm bi bay xung quanh giống hệt thiết kế 100%, 
              bạn nên export cụm icon này từ Figma thành 1 file .png (hoặc .svg) và dùng thẻ <Image> ở đây.
              Tạm thời tôi dùng View và Icon vector để tạo vòng tròn tích xanh cơ bản. */}
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Feather name="check" size={50} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Text Area */}
        <Text style={styles.title}>
          Your Order has been{'\n'}accepted
        </Text>
        <Text style={styles.subtitle}>
          Your items have been placed and are on{'\n'}their way to being processed
        </Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryButtonText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBFC', // Nền hơi ngả xám hồng nhẹ theo thiết kế
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(92, 184, 116, 0.2)', // Vòng tròn mờ bên ngoài
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#5CB874', // Màu xanh lá chủ đạo
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5CB874',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Font có chân giống thiết kế
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, // Tránh dải home ảo của iOS
  },
  primaryButton: {
    backgroundColor: '#5D3A4A', // Màu Maroon
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Match font với thiết kế
  },
});