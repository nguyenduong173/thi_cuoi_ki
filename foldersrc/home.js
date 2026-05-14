import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useCart } from './cartcontext'; 

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert("Thành công", `Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const ProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
          <AntDesign name="plus" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>FurnitureCo.</Text>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput placeholder="Search Store" style={styles.searchInput} placeholderTextColor="#888" />
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image source={require('../assets/banner.png')} style={styles.bannerImage} />
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Exclusive Offer - 1 Dòng (2 sản phẩm) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exclusive Offer</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.productGrid}>
          <ProductCard item={{ id: '1', name: 'Áo len', price: 150000, image: require('../assets/ao_len.png') }} />
          <ProductCard item={{ id: '2', name: 'Áo len xanh', price: 150000, image: require('../assets/ao_len_2.png') }} />
        </View>

        {/* Best Selling - 2 Dòng (4 sản phẩm) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Selling</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.productGrid}>
          <ProductCard item={{ id: '3', name: 'Áo hoodie', price: 200000, image: require('../assets/ao_hoodie.png') }} />
          <ProductCard item={{ id: '4', name: 'Túi xách tay', price: 300000, image: require('../assets/tui_xach_tay.png') }} />
          <ProductCard item={{ id: '5', name: 'Ví da', price: 80000, image: require('../assets/vi_da.png') }} />
          <ProductCard item={{ id: '6', name: 'Kính râm', price: 50000, image: require('../assets/kinh_ram.png') }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' },
  brandTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  searchSection: { paddingHorizontal: 20, marginTop: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: '#F2F3F2', borderRadius: 15, paddingHorizontal: 15, height: 50, alignItems: 'center' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },
  bannerContainer: { paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
  bannerImage: { width: width - 40, height: 115, borderRadius: 15, resizeMode: 'cover' },
  pagination: { flexDirection: 'row', marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DDD', marginHorizontal: 3 },
  activeDot: { backgroundColor: '#704D5B', width: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#181725' },
  seeAll: { color: '#704D5B', fontWeight: '500' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  card: { width: '47%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 18, padding: 12, marginBottom: 15 },
  productImage: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 15 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#181725' },
  addButton: { backgroundColor: '#704D5B', width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});