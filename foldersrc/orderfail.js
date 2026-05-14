import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrderFailedScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Phần khoảng trống phía trên (Nếu sau này bạn muốn thêm icon X màu đỏ thì chèn vào đây) */}
        <View style={styles.spacer} />

        {/* Text Area */}
        <Text style={styles.title}>
          Oops! Order Failed
        </Text>
        <Text style={styles.subtitle}>
          Something went terribly wrong.
        </Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Please Try Again</Text>
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
    backgroundColor: '#FCFBFC', // Màu nền sáng giống màn hình Success
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  spacer: {
    height: 100, // Đẩy text xuống giữa màn hình tương tự như thiết kế
  },
  title: {
    fontSize: 28,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Match font Serif
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
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
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
});