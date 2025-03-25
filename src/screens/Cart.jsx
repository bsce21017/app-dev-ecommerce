import React from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';

const Cart = ({ navigation }) => {
  const cartItems = [
    { 
      id: "1",
      title: "Premium Calligraphy Set",
      description: "Complete set with 3 nibs, ink, and premium paper",
      price: 340,
      image: require('./../../assets/sun.png')
    },
    { 
      id: "2",
      title: "Islamic Art Brush",
      description: "Professional quality brush for intricate designs",
      price: 220,
      image: require('./../../assets/sun.png')
    },
    // Add more items as needed
  ];

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable 
        style={styles.checkbox}
        onPress={() => console.log('Toggle selection')}
      />
      
      <Pressable style={styles.imageContainer}>
        <Image 
          style={styles.productImage} 
          source={item.image} 
          resizeMode='contain'
        />
      </Pressable>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>PKR {item.price}</Text>
      </View>
    </View>
  );

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
              <Text style={styles.subtotal}>SUBTOTAL: PKR 560</Text>
              <Text style={styles.shipping}>Shipping: PKR 300</Text>
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
    fontSize: 19,
    fontFamily: 'Pacifico',
  },
  itemCount: {
    color: 'gray',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#636363',
    // marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 80,
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
  imageContainer: {
    borderRadius: 8,
    backgroundColor: '#E7C574',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '80%',
    height: '80%',
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
  },
  itemPrice: {
    color: '#E7C574',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E7C574',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 12,
    paddingHorizontal: 16,
  },

  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceDetails: {
    // marginRight: 16,
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: 'bold',
  },
  shipping: {
    fontSize: 12,
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 4,
    // paddingVertical: 8,
    paddingHorizontal: 6,
    marginLeft: 40,
  },
  checkoutText: {
    color: '#E7C574',
    fontWeight: 'bold',
  },
});

export default Cart;