import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Platform,
  ScrollView,
  FlatList
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ name: 'Guest', email: '' });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('USER_ACCOUNT');
        if (jsonValue != null) {
          const data = JSON.parse(jsonValue);
          setUserData({
            name: data.name || 'Người dùng',
            email: data.email
          });
        }
      } catch (e) {
        console.error("Lỗi lấy thông tin:", e);
      }
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    if (showOrders) {
      const getOrders = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('ORDERS');
          if (jsonValue != null) {
            setOrders(JSON.parse(jsonValue));
          }
        } catch (e) {
          console.error("Lỗi lấy đơn hàng:", e);
        }
      };
      getOrders();
    }
  }, [showOrders]);

  const handleLogout = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => setSelectedOrder(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderId}>#{item.id}</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.orderItems}
      >
        {item.items.map((product) => (
          <View key={product.id} style={styles.orderItemThumb}>
            <Image source={product.image} style={styles.orderItemImage} />
            <Text style={styles.orderItemQty}>{product.quantity}x</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.orderDelivery}>{item.deliveryMethod}</Text>
          <Text style={styles.orderDelivery}>{item.paymentMethod}</Text>
          <Text style={styles.orderTotal}>
            {item.totalPrice.toLocaleString('vi-VN')}đ
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#704D5B" />
      </View>
    </TouchableOpacity>
  );

  const OptionRow = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Feather name={icon} size={22} color="#181725" style={styles.optionIcon} />
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="#181725" />
    </TouchableOpacity>
  );

  const renderOrderDetail = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setSelectedOrder(null)}>
          <Ionicons name="chevron-back" size={28} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Order Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.detailContent}>
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>#{selectedOrder.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date</Text>
            <Text style={styles.infoValue}>{selectedOrder.date}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          {selectedOrder.items.map((product) => (
            <View key={product.id} style={styles.detailProductCard}>
              <Image source={product.image} style={styles.detailProductImage} />
              <View style={styles.detailProductInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {product.price.toLocaleString('vi-VN')}đ × {product.quantity}
                </Text>
              </View>
              <Text style={styles.productSubtotal}>
                {(product.price * product.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Method</Text>
            <Text style={styles.summaryValue}>{selectedOrder.deliveryMethod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{selectedOrder.paymentMethod}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              {selectedOrder.totalPrice.toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  if (selectedOrder) {
    return renderOrderDetail();
  }

  if (showOrders) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.ordersHeader}>
          <TouchableOpacity onPress={() => setShowOrders(false)}>
            <Ionicons name="chevron-back" size={28} color="#181725" />
          </TouchableOpacity>
          <Text style={styles.ordersTitle}>My Orders</Text>
          <View style={{ width: 28 }} />
        </View>

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ordersList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyOrders}>
            <Feather name="inbox" size={60} color="#DDD" />
            <Text style={styles.emptyOrdersText}>No orders yet</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
          style={styles.avatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <OptionRow 
          icon="shopping-bag" 
          title="Orders" 
          onPress={() => setShowOrders(true)}
        />
        <OptionRow icon="heart" title="My Details" />
        <OptionRow icon="map-pin" title="Delivery Address" />
        <OptionRow icon="credit-card" title="Payment Methods" />
        <OptionRow icon="bell" title="Notifications" />
        <OptionRow icon="help-circle" title="Help" />
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={22} color="#5D3A4A" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', alignItems: 'center', 
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    marginTop: Platform.OS === 'android' ? 20 : 0
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#181725', marginBottom: 5 },
  email: { fontSize: 14, color: '#7C7C7C' },
  optionsContainer: { paddingHorizontal: 20, marginTop: 10 },
  optionRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' 
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionIcon: { marginRight: 15 },
  optionTitle: { fontSize: 16, color: '#181725', fontWeight: '500' },
  logoutContainer: { padding: 20, marginTop: 20 },
  logoutButton: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#F2F3F2', paddingVertical: 18, borderRadius: 15 
  },
  logoutIcon: { marginRight: 10 },
  logoutText: { color: '#5D3A4A', fontSize: 18, fontWeight: 'bold' },
  ordersHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EAEAEA'
  },
  ordersTitle: { fontSize: 20, fontWeight: 'bold', color: '#181725' },
  ordersList: { paddingHorizontal: 20, paddingVertical: 15 },
  orderCard: { 
    backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15, marginBottom: 15,
    borderWidth: 1, borderColor: '#EAEAEA'
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderDate: { fontSize: 14, color: '#7C7C7C' },
  orderId: { fontSize: 14, fontWeight: '600', color: '#181725' },
  orderItems: { marginBottom: 12 },
  orderItemThumb: { marginRight: 10, alignItems: 'center' },
  orderItemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#FFF' },
  orderItemQty: { fontSize: 12, fontWeight: '600', color: '#704D5B', marginTop: 4 },
  orderFooter: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EAEAEA'
  },
  orderDelivery: { fontSize: 12, color: '#888', marginBottom: 4 },
  orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#181725' },
  emptyOrders: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyOrdersText: { marginTop: 15, fontSize: 16, color: '#CCC' },
  detailHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EAEAEA'
  },
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: '#181725' },
  detailContent: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  detailSection: { marginBottom: 20, backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#181725' },
  detailProductCard: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' 
  },
  detailProductImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12, backgroundColor: '#FFF' },
  detailProductInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: '#181725', marginBottom: 4 },
  productPrice: { fontSize: 12, color: '#888' },
  productSubtotal: { fontSize: 14, fontWeight: '700', color: '#704D5B' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#181725' },
  totalRow: { paddingTop: 15, borderTopWidth: 1, borderTopColor: '#EAEAEA' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#181725' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#704D5B' },
});
