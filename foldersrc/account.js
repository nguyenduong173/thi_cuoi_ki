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
  FlatList,
  Alert,
  Modal,
  TextInput,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountScreen() {
  const navigation = useNavigation();
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const [userData, setUserData] = useState({ name: 'Guest', email: '', avatarUrl: defaultAvatar, phone: '', birthdate: '' });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State mới để điều khiển hiển thị trang My Details
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const [nameInput, setNameInput] = useState('Guest');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [birthdateInput, setBirthdateInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('USER_ACCOUNT');
        if (jsonValue != null) {
          const data = JSON.parse(jsonValue);
          const profile = {
            name: data.name || 'Người dùng',
            email: data.email || '',
            avatarUrl: data.avatarUrl || defaultAvatar,
            phone: data.phone || '',
            birthdate: data.birthdate || ''
          };
          setUserData(profile);
          setNameInput(profile.name);
          setEmailInput(profile.email);
          setPhoneInput(profile.phone);
          setBirthdateInput(profile.birthdate);
          setAvatarUrl(profile.avatarUrl);
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

  const restoreProfileFields = (profile) => {
    const current = profile || userData;
    setNameInput(current.name || 'Người dùng');
    setEmailInput(current.email || '');
    setPhoneInput(current.phone || '');
    setBirthdateInput(current.birthdate || '');
    setAvatarUrl(current.avatarUrl || defaultAvatar);
  };

  const formatBirthdate = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  let formatted = '';

  if (digits.length >= 1) {
    formatted += digits.slice(0, 2);
  }

  if (digits.length >= 3) {
    formatted += '/' + digits.slice(2, 4);
  } else if (digits.length > 2) {
    formatted += '/';
  }

  if (digits.length >= 5) {
    formatted += '/' + digits.slice(4, 8);
  } else if (digits.length > 4) {
    formatted += '/';
  }

  setBirthdateInput(formatted);
};

  const saveProfile = async () => {
    try {
      const updated = {
        name: nameInput.trim() || 'Người dùng',
        email: emailInput.trim(),
        phone: phoneInput.trim(),
        birthdate: birthdateInput.trim(),
        avatarUrl: avatarUrl || defaultAvatar,
      };
      await AsyncStorage.setItem('USER_ACCOUNT', JSON.stringify(updated));
      setUserData(updated);
      setEditingProfile(false);
      Alert.alert('Cập nhật thành công', 'Thông tin của bạn đã được lưu.');
    } catch (e) {
      console.error('Lỗi lưu thông tin:', e);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    }
  };

  const cancelEdit = () => {
    restoreProfileFields();
    setEditingProfile(false);
  };

  const cancelOrder = async (orderId) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      setOrders(updatedOrders);
      await AsyncStorage.setItem('ORDERS', JSON.stringify(updatedOrders));
    } catch (e) {
      console.error("Lỗi hủy đơn hàng:", e);
    }
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
      {item.status === 'cancelled' && (
        <Text style={styles.cancelledText}>Đã hủy</Text>
      )}
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

  // Giao diện My Details
  const renderProfileDetail = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => {
          if (editingProfile) {
            cancelEdit();
          } else {
            setShowProfileDetail(false);
          }
        }}>
          <Ionicons name="chevron-back" size={28} color="#181725" />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>My Details</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => {
            if (editingProfile) {
              saveProfile();
            } else {
              setEditingProfile(true);
            }
          }}
        >
          <Text style={styles.headerActionText}>{editingProfile ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={styles.keyboardContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.profileScrollView}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: avatarUrl }}
              style={styles.avatarLarge} 
            />
            <TouchableOpacity
              onPress={() => {
                if (editingProfile) setAvatarPickerVisible(true);
              }}
            >
              <Text style={styles.editText}>{editingProfile ? 'Thay đổi ảnh đại diện' : 'Bật chỉnh sửa để đổi ảnh'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Họ và Tên</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.fieldInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.name}</Text>
              )}
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.fieldInput}
                  value={emailInput}
                  onChangeText={setEmailInput}
                  keyboardType="email-address"
                  placeholder="Nhập email"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.email}</Text>
              )}
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Số điện thoại</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.fieldInput}
                  value={phoneInput}
                  onChangeText={setPhoneInput}
                  keyboardType="phone-pad"
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#999"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.phone || 'Chưa cập nhật'}</Text>
              )}
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Ngày sinh</Text>
              {editingProfile ? (
                <TextInput
                  style={styles.fieldInput}
                  value={birthdateInput}
                  onChangeText={formatBirthdate}
                  placeholder="dd/mm/yyyy"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              ) : (
                <Text style={styles.fieldValue}>{userData.birthdate || 'Chưa cập nhật'}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={avatarPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAvatarPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.avatarModal}>
            <Text style={styles.modalTitle}>Chọn ảnh đại diện</Text>
            <View style={styles.avatarOptions}>
              {[
                'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                'https://cdn-icons-png.flaticon.com/512/147/147144.png',
                'https://cdn-icons-png.flaticon.com/512/1995/1995560.png'
              ].map((uri) => (
                <TouchableOpacity key={uri} onPress={() => {
                  setAvatarUrl(uri);
                  setAvatarPickerVisible(false);
                }} style={styles.avatarOption}>
                  <Image source={{ uri }} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalInputLabel}>Hoặc nhập URL ảnh</Text>
            <TextInput
              style={styles.modalInput}
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              placeholder="https://..."
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAvatarPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, selectedOrder.status === 'cancelled' && styles.cancelledStatus]}>
              {selectedOrder.status === 'cancelled' ? 'Đã bị hủy' : 'Hoạt động'}
            </Text>
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

      {selectedOrder.status !== 'cancelled' && (
        <TouchableOpacity 
          style={styles.cancelOrderButton}
          onPress={() => {
            Alert.alert(
              "Xác nhận hủy đơn hàng",
              "Bạn có chắc muốn hủy đơn hàng này không?",
              [
                { text: "Không", style: "cancel" },
                { text: "Có", onPress: () => { cancelOrder(selectedOrder.id); setSelectedOrder(null); } }
              ]
            );
          }}
        >
          <Text style={styles.cancelOrderText}>Hủy đơn hàng</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );

  if (showProfileDetail) {
    return renderProfileDetail();
  }

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
          source={{ uri: userData.avatarUrl || defaultAvatar }} 
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
        <OptionRow 
          icon="heart" 
          title="My Details" 
          onPress={() => setShowProfileDetail(true)} 
        />
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
  cancelledText: { 
    textAlign: 'center', 
    color: '#FF6B6B', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 10 
  },
  detailHeader: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EAEAEA'
  },
  detailTitle: { fontSize: 20, fontWeight: 'bold', color: '#181725' },
  headerAction: { paddingHorizontal: 10, paddingVertical: 6 },
  headerActionText: { fontSize: 14, color: '#5D3A4A', fontWeight: '700' },
  detailContent: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  detailSection: { marginBottom: 20, backgroundColor: '#F9F9F9', borderRadius: 12, padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#181725', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#181725' },
  cancelledStatus: { color: '#FF6B6B' },
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
  
  // Style cho My Details
  profileSection: { alignItems: 'center', marginTop: 30, marginBottom: 10 },
  keyboardContainer: { flex: 1 },
  profileScrollView: { flex: 1, paddingHorizontal: 20 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  editText: { color: '#5D3A4A', fontWeight: '600', fontSize: 16 },
  infoSection: { paddingHorizontal: 20, marginTop: 10 },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#181725',
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  avatarModal: { backgroundColor: '#FFF', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#181725', marginBottom: 16 },
  avatarOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  avatarOption: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E5E5' },
  avatarOptionImage: { width: 80, height: 80 },
  modalInputLabel: { fontSize: 14, color: '#7C7C7C', marginBottom: 8 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
    color: '#181725',
    marginBottom: 16,
  },
  modalCloseButton: { alignItems: 'center', paddingVertical: 14, backgroundColor: '#5D3A4A', borderRadius: 14 },
  modalCloseText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  fieldContainer: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F2F3F2' },
  fieldLabel: { fontSize: 14, color: '#7C7C7C', marginBottom: 6 },
  fieldValue: { fontSize: 16, color: '#181725', fontWeight: '500' },
  cancelOrderButton: { 
    backgroundColor: '#FF6B6B', 
    marginHorizontal: 20, 
    marginBottom: 20, 
    paddingVertical: 15, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  cancelOrderText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});