import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Pressable, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconA from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "./../../firebaseConfig";

const SellerStore = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is signed in');
        return;
      }

      const userDoc = await getDoc(doc(db, 'seller', user.uid));
      if (userDoc.exists()) {
        setName(userDoc.data().businessName);
      } else {
        setError('No seller document found');
      }
 
      const productsRef = collection(db, 'products', user.uid, 'published_products');
      const querySnapshot = await getDocs(productsRef);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: doc.data().images?.[0]
          ? { uri: doc.data().images[0] }
          : require("./../../assets/frame.png")
      }));

      setProducts(productsList);
    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchStoreData);
    fetchStoreData();
    return unsubscribe;
  }, [navigation]);

  const orderStats = [
    { icon: "credit-card", label: "Earnings" },
    { icon: "truck", label: "To Ship" },
    { icon: "download", label: "Confirmed" },
    { icon: "legal", label: "Violations" },
    { icon: "undo", label: "Returns" }
  ];

  const storeOptions = [
    "Most Loved Products",
    "Tips and Tricks",
    "Top Sellers"
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F0C14B" />
          <Text style={styles.loadingText}>Loading your products...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color="#F0C14B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchStoreData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.section}>
          {products.length > 0 ? (
            <View style={styles.productGrid}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('EditProduct', {
                    productId: product.id,
                    isDraft: false
                  })}
                >
                  <Image source={product.image} style={styles.productImage} />
                  <Text style={styles.salesText}>{product.sales || 0} SALES</Text>
                  <Text style={styles.itemName}>{product.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noProductsContainer}>
              <Icon name="inventory" size={48} color="gray" />
              <Text style={styles.noProductsText}>No products yet</Text>
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{name || "Your Store"}</Text>
          <Pressable onPress={() => navigation.navigate('StoreSettings')}>
            <Icon name="settings" size={24} color="#F0C14B" />
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>36</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>67</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.orderStatusContainer}
          >
            {orderStats.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.orderItem}
                onPress={() => navigation.navigate('OrdersReceived', { filter: item.label })}
              >
                <IconA name={item.icon} size={24} color="#F0C14B" />
                <Text style={styles.orderText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.optionsContainer}>
            {storeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionItem}
                onPress={() => navigation.navigate('StoreTips')}
              >
                <Text style={styles.optionText}>{option}</Text>
                <Icon name="chevron-right" size={20} color="#F0C14B" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Text style={styles.addProductText}>ADD NEW PRODUCT</Text>
          <Icon name="add-circle" size={24} color="#F0C14B" />
        </TouchableOpacity>
        {renderContent()}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E13',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#F0C14B',
    marginTop: 16,
  },
  errorContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#F0C14B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0C14B',
    fontFamily: 'Pacifico',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    borderRadius: 8,
    // padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0C14B',
  },
  statLabel: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  orderStatusContainer: {
    // paddingHorizontal: 8,
  },
  orderItem: {
    alignItems: 'center',
    marginRight: 20,
    // padding: 8,
  },
  orderText: {
    fontSize: 12,
    color: '#F0C14B',
    marginTop: 8,
  },
  optionsContainer: {
    backgroundColor: '#111',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    color: '#F0C14B',
    fontSize: 14,
  },
  addProductButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#48494B',
    borderRadius: 8,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addProductText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0C14B',
    marginRight: 8,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#111',
    width: '40%',
    borderRadius: 8,
    // padding: 12,
    marginBottom: 4,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 4,
  },
  salesText: {
    fontSize: 12,
    color: '#F0C14B',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: -14,
    marginBottom: 5,
  },
  noProductsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noProductsText: {
    color: 'gray',
    fontSize: 16,
    marginTop: 16,
  },
});

export default SellerStore;