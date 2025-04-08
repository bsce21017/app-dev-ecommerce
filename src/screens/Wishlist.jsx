import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { getAuth } from 'firebase/auth';
import { doc, collection, getDocs, getDoc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, app } from '../../firebaseConfig';

const Wishlist = ({ navigation }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const auth = getAuth(app);

  const fetchWishlistItems = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const wishlistRef = collection(db, 'customers', user.uid, 'wishlist');
      const wishlistSnapshot = await getDocs(wishlistRef);

      const wishlistData = [];

      for (const docSnap of wishlistSnapshot.docs) {
        const productId = docSnap.id;
        const sellerId = docSnap.data().sellerId;

        const productRef = doc(db, 'products', sellerId, 'published_products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          wishlistData.push({
            id: productId,
            sellerId,
            ...productSnap.data()
          });
        }
      }

      setWishlistItems(wishlistData);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      Alert.alert('Error', 'Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const wishlistRef = doc(db, 'customers', user.uid, 'wishlist', productId);
      await deleteDoc(wishlistRef);

      // Refresh wishlist after removal
      fetchWishlistItems();
      Alert.alert('Success', 'Item removed from wishlist');
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You need to be logged in to add items to cart');
        return;
      }

      const customerRef = doc(db, 'customers', user.uid);
      const cartRef = doc(collection(customerRef, 'cart'), item.id);

      const cartItemSnap = await getDoc(cartRef);

      if (cartItemSnap.exists()) {
        await updateDoc(cartRef, {
          quantity: cartItemSnap.data().quantity + 1
        });
      } else {
        await setDoc(cartRef, {
          quantity: 1,
          sellerId: item.sellerId,
        });
      }

      handleRemoveItem(item.id);

      Alert.alert('Success', `${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleAddAllToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You need to be logged in to add items to cart');
        return;
      }

      for (const item of wishlistItems) {
        const cartRef = doc(collection(db, 'customers', user.uid, 'cart'), item.id);
        const cartItemSnap = await getDoc(cartRef);

        if (cartItemSnap.exists()) {
          await updateDoc(cartRef, {
            quantity: cartItemSnap.data().quantity + 1
          });
        } else {
          await setDoc(cartRef, {
            quantity: 1,
            sellerId: item.sellerId,
          });
        }
        handleRemoveItem(item.id);
      }

      Alert.alert('Success', 'All items added to cart!');
    } catch (error) {
      console.error('Error adding all to cart:', error);
      Alert.alert('Error', 'Failed to add items to cart');
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  useEffect(() => {
    console.log('Fetching wishlist items...');
    const unsubscribe = navigation.addListener('focus', () => {
      fetchWishlistItems();
    });

    return unsubscribe;
  }, []);

  const renderWishlistItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable
        style={[
          styles.checkbox,
          selectedItems.includes(item.id) && styles.selectedCheckbox
        ]}
        onPress={() => toggleItemSelection(item.id)}
      />

      <Pressable
        style={styles.imageContainer}
        onPress={() => navigation.navigate('Product', {
          productId: item.id,
          sellerId: item.sellerId
        })}
      >
        <Image
          style={styles.productImage}
          source={
            item.images && item.images.length > 0
              ? { uri: item.images[0] }
              : require('./../../assets/frame.png')
          }
          resizeMode='contain'
        />
      </Pressable>

      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>PKR {item.price}</Text>

        <View style={styles.actionButtons}>
          <Pressable
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addToCartText}>ADD TO CART</Text>
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Icon name="trash" size={16} color="#E7C574" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E7C574" />
        <Text style={{ color: '#fff' }}>Loading wishlist...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require('./../../assets/arrow.png')}
              style={styles.backIcon}
            />
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>MY WISHLIST</Text>
            <Text style={styles.itemCount}>{wishlistItems.length} ITEMS</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="heart-o" size={50} color="#E7C574" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <Pressable
            style={styles.footerButton}
            onPress={handleAddAllToCart}
          >
            <Text style={styles.footerButtonText}>ADD ALL TO CART</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#E7C574',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerTitle: {
    color: '#E7C574',
    fontSize: 24,
    fontFamily: 'Pacifico',
  },
  itemCount: {
    color: 'gray',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#636363',
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#E7C574',
    fontSize: 18,
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#E7C574',
    borderRadius: 4,
    marginRight: 12,
  },
  selectedCheckbox: {
    backgroundColor: '#E7C574',
  },
  imageContainer: {
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  itemPrice: {
    color: '#E7C574',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: '#E7C574',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  addToCartText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 6,
  },
  footerButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E7C574',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
});

export default Wishlist;