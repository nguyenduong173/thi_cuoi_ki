import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from './cartcontext'; // Sử dụng context để lấy dữ liệu thật

export default function CartScreen() {
  // Lấy dữ liệu và các hàm xử lý từ kho lưu trữ chung (Context)
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');

  // Tính tổng tiền dựa trên danh sách trong giỏ
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const QuantityInput = ({ id, quantity }) => {
    const [text, setText] = useState(String(quantity));

    useEffect(() => {
      setText(String(quantity));
    }, [quantity]);

    const handleChange = (value) => {
      const digits = value.replace(/[^0-9]/g, '');
      setText(digits);
    };

    const handleEndEditing = () => {
      const parsed = parseInt(text, 10);
      updateQuantity(id, parsed && parsed > 0 ? parsed : 1);
    };

    return (
      <TextInput
        style={styles.qtyInput}
        value={text}
        onChangeText={handleChange}
        onEndEditing={handleEndEditing}
        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        returnKeyType="done"
        blurOnSubmit={true}
      />
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Ionicons name="close-outline" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemFooter}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 'dec')}>
              <AntDesign name="minus" size={16} color="#888" />
            </TouchableOpacity>
            
            <QuantityInput id={item.id} quantity={item.quantity} />
            
            <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 'inc')}>
              <AntDesign name="plus" size={16} color="#704D5B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemPrice}>
            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
          </Text>
        </View>
      </View>
    </View>
  );

  const CheckoutRow = ({ label, value, isTotal, hideArrow }) => (
    <View style={styles.checkoutRow}>
      <Text style={styles.checkoutLabel}>{label}</Text>
      <View style={styles.checkoutValueContainer}>
        <Text style={[styles.checkoutValue, isTotal && styles.checkoutTotalValue]}>{value}</Text>
        {!hideArrow && <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />}
      </View>
    </View>
  );

  const DeliveryOption = ({ type, title, desc, price, selected }) => (
    <TouchableOpacity 
      style={[styles.deliveryOption, selected && styles.deliveryOptionSelected]}
      onPress={() => setSelectedDelivery(type)}
    >
      <View style={[styles.deliveryRadio, selected && styles.deliveryRadioSelected]}>
        {selected && <View style={styles.deliveryRadioDot} />}
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryTitle}>{title}</Text>
        <Text style={styles.deliveryDesc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );

  const PaymentOption = ({ type, title, desc, color, selected }) => (
    <TouchableOpacity
      style={[styles.paymentOption, selected && { borderColor: color, backgroundColor: `${color}15`} ]}
      onPress={() => setSelectedPayment(type)}
    >
      <View style={[styles.paymentBadge, { backgroundColor: color }]}> 
        <Text style={styles.paymentBadgeText}>{type === 'cod' ? 'COD' : type === 'mastercard' ? 'MC' : 'PP'}</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryTitle}>{title}</Text>
        <Text style={styles.deliveryDesc}>{desc}</Text>
      </View>
      <View style={[styles.deliveryRadio, selected && { borderColor: color }]}>
        {selected && <View style={[styles.deliveryRadioDot, { backgroundColor: color }]} />}
      </View>
    </TouchableOpacity>
  );

  const saveOrder = async () => {
    try {
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        totalPrice: getTotalPrice(),
        deliveryMethod: selectedDelivery === 'standard' ? 'Standard Delivery' : 'Express Delivery',
        paymentMethod: selectedPayment === 'cod' ? 'Cash on Delivery (COD)' : selectedPayment === 'mastercard' ? 'Mastercard' : 'PayPal',
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'active',
      };

      const existingOrders = await AsyncStorage.getItem('ORDERS');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      await AsyncStorage.setItem('ORDERS', JSON.stringify(orders));
      
      return true;
    } catch (error) {
      console.error('Lỗi lưu đơn hàng:', error);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Hiển thị thông báo nếu giỏ hàng trống
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="shopping-bag" size={60} color="#EEE" />
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        }
      />

      {/* Nút thanh toán chỉ hiện khi có hàng */}
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => setCheckoutVisible(true)}
        >
          <Text style={styles.checkoutText}>Go to Checkout</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalAmountText}>
              {getTotalPrice().toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Modal Checkout */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCheckoutVisible}
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Checkout</Text>
              <TouchableOpacity onPress={() => setCheckoutVisible(false)}>
                <Ionicons name="close" size={28} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetContent}>
              <Text style={styles.deliveryLabel}>Delivery Method</Text>
              <DeliveryOption 
                type="standard" 
                title="Standard Delivery – Giao tiêu chuẩn" 
                desc="Rẻ hơn • Giao trong vài ngày"
                price="15,000đ"
                selected={selectedDelivery === 'standard'}
              />
              <DeliveryOption 
                type="express" 
                title="Express/Fast Delivery – Giao nhanh" 
                desc="Phí cao hơn • Giao nhanh hơn (1-2 ngày)"
                price="50,000đ"
                selected={selectedDelivery === 'express'}
              />

              <Text style={styles.deliveryLabel}>Payment Method</Text>
              <PaymentOption
                type="cod"
                title="Cash on Delivery (COD)"
                desc="Thanh toán khi nhận hàng"
                color="#2E8B57"
                selected={selectedPayment === 'cod'}
              />
              <PaymentOption
                type="mastercard"
                title="Mastercard"
                desc="Thanh toán bằng thẻ Mastercard"
                color="#F7931A"
                selected={selectedPayment === 'mastercard'}
              />
              <PaymentOption
                type="paypal"
                title="PayPal"
                desc="Thanh toán qua PayPal"
                color="#003087"
                selected={selectedPayment === 'paypal'}
              />

              <CheckoutRow 
                label="Total Cost" 
                value={getTotalPrice().toLocaleString('vi-VN') + 'đ'} 
                isTotal={true}
                hideArrow={true}
              />
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By placing an order you agree to our{'\n'}
                <Text style={styles.termsHighlight}>Terms</Text> And <Text style={styles.termsHighlight}>Conditions</Text>
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.placeOrderButton}
              onPress={async () => {
                const saved = await saveOrder();
                if (saved) {
                  setCheckoutVisible(false);
                  alert('Đặt hàng thành công!');
                  clearCart();
                }
              }}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  listContent: { padding: 20, paddingBottom: 100 },
  cartItem: { flexDirection: 'row', marginBottom: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', paddingBottom: 20 },
  itemImage: { width: 80, height: 80, resizeMode: 'contain', backgroundColor: '#F9F9F9', borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 15 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', borderRadius: 20, paddingHorizontal: 5 },
  qtyBtn: { padding: 8 },
  qtyInput: {
    minWidth: 50,
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  itemPrice: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#5D3A4A', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 15 },
  checkoutText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  totalBadge: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  totalAmountText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 20, color: '#999', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#F7F7F7', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingBottom: 40, minHeight: '55%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  sheetContent: { paddingVertical: 10 },
  checkoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  checkoutLabel: { fontSize: 16, color: '#888' },
  checkoutValueContainer: { flexDirection: 'row', alignItems: 'center' },
  checkoutValue: { fontSize: 16, color: '#333', marginRight: 10 },
  checkoutTotalValue: { fontWeight: 'bold', fontSize: 18 },
  deliveryLabel: { fontSize: 16, fontWeight: '600', color: '#181725', marginBottom: 12 },
  deliveryOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E0E0E0', marginBottom: 10 },
  deliveryOptionSelected: { borderColor: '#704D5B', backgroundColor: 'rgba(112, 77, 91, 0.05)' },
  deliveryRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CCC', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  deliveryRadioSelected: { borderColor: '#704D5B' },
  deliveryRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#704D5B' },
  deliveryInfo: { flex: 1 },
  deliveryTitle: { fontSize: 14, fontWeight: '600', color: '#181725', marginBottom: 4 },
  deliveryDesc: { fontSize: 12, color: '#888' },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    backgroundColor: '#FFF'
  },
  paymentOptionSelected: {
    backgroundColor: 'rgba(0,0,0,0.03)'
  },
  paymentBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  paymentBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  mastercardIcon: { flexDirection: 'row', marginRight: 10, alignItems: 'center' },
  circle: { width: 18, height: 18, borderRadius: 9, opacity: 0.8 },
  visaText: { fontSize: 14, color: '#1434CB', fontWeight: '600', marginLeft: 8 },
  termsContainer: { marginTop: 20, marginBottom: 20 },
  termsText: { fontSize: 13, color: '#888', lineHeight: 20 },
  termsHighlight: { color: '#333', fontWeight: '600' },
  placeOrderButton: { backgroundColor: '#5D3A4A', paddingVertical: 18, borderRadius: 15, alignItems: 'center' },
  placeOrderText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});