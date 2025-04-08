import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, collection, getDocs, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // your firebase config file

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  const fetchCartItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const cartRef = collection(db, 'customers', user.uid, 'cart');
      const cartSnapshot = await getDocs(cartRef);

      const cartData = [];

      for (const docSnap of cartSnapshot.docs) {
        const productId = docSnap.id;
        const quantity = docSnap.data().quantity;
        const sellerId = docSnap.data().sellerId;

        const productRef = doc(db, 'products', sellerId, 'published_products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          cartData.push({
            id: productId,
            quantity,
            ...productSnap.data()
          });
        }
      }

      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable
        style={styles.checkbox}
        onPress={() => console.log('Toggle selection')}
      />

      <Pressable style={styles.imageContainer}>
        <Image
          style={styles.productImage}
          source={{ uri: item.images[0] }} // make sure imageURL is a direct link
          resizeMode='contain'
        />
      </Pressable>

      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.itemPrice}>PKR {item.price}</Text>
          <Text style={styles.itemPrice}>Qty: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 300;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E7C574" />
        <Text style={{ color: '#fff' }}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image
              source={require('./../../assets/arrow.png')}
              style={styles.backIcon}
            />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>MY CART</Text>
            <Text style={styles.itemCount}>ITEMS: {cartItems.length}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <View style={styles.priceDetails}>
              <Text style={styles.subtotal}>SUBTOTAL: PKR {subtotal}</Text>
              <Text style={styles.shipping}>Shipping: PKR {shipping}</Text>
            </View>

            <Pressable style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>CHECKOUT</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 8 },
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24, tintColor: '#E7C574' },
  headerContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 16 },
  headerTitle: { color: '#E7C574', fontSize: 19, fontFamily: 'Pacifico' },
  itemCount: { color: 'gray', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#636363' },
  listContent: { paddingBottom: 80 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
  checkbox: { height: 20, width: 20, borderWidth: 1, borderColor: '#E7C574', borderRadius: 4, marginRight: 12 },
  imageContainer: { borderRadius: 8, backgroundColor: '#E7C574', width: 80, height: 80, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  detailsContainer: { flex: 1, marginLeft: 12 },
  itemTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 0 },
  itemDescription: { color: '#AAA', fontSize: 12, marginBottom: 8 },
  itemPrice: { color: '#E7C574', fontSize: 18, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#E7C574', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
  totalContainer: { flexDirection: 'row', alignItems: 'center' },
  priceDetails: { alignItems: 'flex-end' },
  subtotal: { fontWeight: 'bold' },
  shipping: { fontSize: 12 },
  checkoutButton: { backgroundColor: '#000', borderRadius: 4, paddingHorizontal: 6, marginLeft: 40 },
  checkoutText: { color: '#E7C574', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }
});

export default Cart;
