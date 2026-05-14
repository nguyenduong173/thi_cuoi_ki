import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useCart } from './cartcontext';

const DATA = [
  { id: '1', name: 'Áo len', price: 150000, image: require('../assets/ao_len.png') },
  { id: '2', name: 'Áo len', price: 150000, image: require('../assets/ao_len_2.png') },
  { id: '3', name: 'Áo hoodie', price: 200000, image: require('../assets/ao_hoodie.png') },
  { id: '4', name: 'Túi xách tay', price: 300000, image: require('../assets/tui_xach_tay.png') },
];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    Alert.alert("Thành công", `Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <AntDesign name="plus" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3F2', borderRadius: 15, paddingHorizontal: 12, height: 50 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  filterButton: { marginLeft: 15 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#FFF', width: '47%', borderRadius: 18, marginBottom: 16, padding: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  productImage: { width: '100%', height: 100, resizeMode: 'contain', marginBottom: 15 },
  cardContent: { flex: 1, justifyContent: 'flex-end' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#181725' },
  addButton: { backgroundColor: '#704D5B', width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});