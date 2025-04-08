import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './../../firebaseConfig';

const image7 = require('./../../assets/logo.png');
const PLACEHOLDER_IMAGE = require('./../../assets/frame.png');

const { width } = Dimensions.get('window');

const Product = ({ route, navigation }) => {
  const { productId, sellerId } = route.params;

  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const getValidImageSource = (uri) => {
    if (!uri || typeof uri !== 'string') {
      return PLACEHOLDER_IMAGE;
    }
    return { uri };
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!productId || !sellerId) {
          throw new Error('Missing product or seller information');
        }

        const productRef = doc(db, `products/${sellerId}/published_products`, productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          let images = [];
          if (Array.isArray(productData.images)) {
            images = productData.images.filter(img => typeof img === 'string');
          } else if (typeof productData.imageUrl === 'string') {
            images = [productData.imageUrl];
          }

          setProduct({
            id: productSnap.id,
            ...productData,
            images: images.length > 0 ? images : [PLACEHOLDER_IMAGE]
          });

          const sellerRef = doc(db, 'seller', sellerId);
          const sellerSnap = await getDoc(sellerRef);
          if (sellerSnap.exists()) {
            setSeller(sellerSnap.data());
          }
        } else {
          throw new Error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
        Alert.alert(
          'Error',
          'Failed to load product details',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, sellerId]);

  const RatingStars = ({ rating = 4 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {Array(fullStars).fill().map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={18} color="#FFD700" />
        ))}
        {hasHalfStar && <Icon name="star-half-full" size={18} color="#FFD700" />}
        {Array(emptyStars).fill().map((_, i) => (
          <Icon key={`empty-${i}`} name="star-o" size={18} color="#FFD700" />
        ))}
      </View>
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const handleAddToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You need to be logged in to add items to cart');
        return;
      }
  
      const customerRef = doc(db, 'customers', user.uid);
      const cartRef = doc(collection(customerRef, 'cart'), productId);
  
      // Check if the product already exists in cart
      const cartItemSnap = await getDoc(cartRef);
  
      if (cartItemSnap.exists()) {
        // Product exists - update quantity
        await updateDoc(cartRef, {
          quantity: cartItemSnap.data().quantity + quantity
        });
        Alert.alert(
          'Cart Updated',
          `Quantity updated to ${cartItemSnap.data().quantity + quantity} for ${product.name}`,
          [{ text: 'OK' }]
        );
      } else {
        // Product doesn't exist - add new item
        await setDoc(cartRef, {
          // productId: product.id,
          quantity: quantity,
          sellerId: sellerId,
        });
        Alert.alert(
          'Added to Cart',
          `${quantity} item(s) of ${product.name} added to cart!`,
          [{ text: 'OK' }]
        );
      }
  
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F0C14B" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={50} color="#FF5252" />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#E7C574" />
        </Pressable>
        <Image style={styles.logo} resizeMode="contain" source={image7} />
        <Pressable style={styles.searchButton}>
          <Text style={styles.searchText}>
            <Icon name="search" size={20} color="black" /> Search For Anything
          </Text>
        </Pressable>
        <Icon name="bell" size={24} color="#FF9800" style={styles.bellIcon} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.mainImageContainer}>
          <Image
            source={getValidImageSource(product.images[selectedImage])}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {product.images.length > 1 && (
          <FlatList
            horizontal
            data={product.images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  index === selectedImage && styles.selectedThumbnail
                ]}
              >
                <Image
                  source={getValidImageSource(item)}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.thumbnailsContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>PKR {product.price}</Text>
            <View style={styles.iconRow}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Pressable style={styles.iconButton}>
            <Icon name="heart" size={18} color="#E7C574" />
          </Pressable>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>PRODUCT DETAILS</Text>
          <Text style={styles.description}>{product.description || 'No description available.'}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>SELLER INFO</Text>
          <Text style={styles.description}>
            {seller?.businessName ? `Sold by: ${seller.businessName}` : 'Seller info not available'}
            {'\n'}
            {seller?.email}
          </Text>
        </View>

        <Pressable style={styles.reviewsContainer}>
          <View style={styles.divider} />
          <View style={styles.reviewsRow}>
            <Text style={styles.sectionTitle}>PRODUCT REVIEWS</Text>
            <RatingStars rating={3.5} />
          </View>
          <View style={styles.divider} />
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.footerButton} onPress={handleAddToCart}>
          <Text style={styles.footerText}>
            ADD TO CART <Icon name="shopping-basket" size={20} color="black" />
          </Text>
        </Pressable>
        <View style={styles.footerDivider} />
        <Pressable style={styles.footerButton}>
          <Text style={styles.footerText}>
            CHAT <Icon name="comments" size={20} color="black" />
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#000'
  },
  logo: { height: 40, width: 45 },
  searchButton: {
    flex: 1,
    backgroundColor: '#E7C574',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  searchText: {
    color: '#000',
    fontSize: 16,
    paddingLeft: 15
  },
  bellIcon: { padding: 5 },
  scrollContainer: { flex: 1 },
  mainImageContainer: {
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E'
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#E7C574',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  infoContainer: { padding: 15 },
  productName: { color: '#E7C574', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  description: { color: '#FFF', fontSize: 14, marginBottom: 10 },
  price: { color: '#E7C574', fontWeight: 'bold', fontSize: 22, marginBottom: 5 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { borderWidth: 1, borderColor: '#E7C574', borderRadius: 5, padding: 5, marginLeft: 0, alignSelf: 'flex-start' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityButton: {
    backgroundColor: '#E7C574',
    borderRadius: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 5,
    // marginVertical: 5,
  },
  quantityButtonText: {
    color: '#000',
    fontSize: 18,
    lineHeight: 35,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFF',
    fontSize: 16,
    width: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#E7C574',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: { backgroundColor: '#636363', height: 1, marginVertical: 10 },
  detailsContainer: { padding: 15 },
  sectionTitle: { color: '#E7C574', fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  reviewsContainer: { paddingHorizontal: 15 },
  reviewsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  ratingContainer: { flexDirection: 'row' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#E7C574',
    borderTopWidth: 1,
    borderColor: '#636363',
    paddingVertical: 5
  },
  footerButton: { flex: 1, alignItems: 'center' },
  footerText: { color: '#000', fontSize: 13, fontWeight: 'bold' },
  footerDivider: { width: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorText: { color: '#FFF', fontSize: 18, marginVertical: 10 },
  backButton: { backgroundColor: '#E7C574', padding: 10, borderRadius: 5 },
  backButtonText: { color: '#000', fontWeight: 'bold' },
});

export default Product;