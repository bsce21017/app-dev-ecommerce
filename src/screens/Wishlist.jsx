import React from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

const Wishlist = ({ navigation }) => {
  const wishlistItems = [
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

  const renderWishlistItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Pressable 
        style={styles.checkbox}
        onPress={() => console.log('Toggle selection')}
      />
      
      <Pressable 
        style={styles.imageContainer}
        onPress={() => navigation.navigate('ProductDetail')}
      >
        <Image 
          style={styles.productImage} 
          source={item.image} 
          resizeMode='contain'
        />
      </Pressable>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.itemPrice}>PKR {item.price}</Text>
        
        <View style={styles.actionButtons}>
          <Pressable style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>ADD TO CART</Text>
          </Pressable>
          <Pressable style={styles.deleteButton}>
            <Icon name="trash" size={16} color="#E7C574" />
          </Pressable>
        </View>
      </View>
    </View>
  );

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
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Footer */}
        <Pressable style={styles.footerButton}>
          <Text style={styles.footerButtonText}>ADD ALL TO CART</Text>
        </Pressable>
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
    // paddingVertical: 6,
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
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Wishlist;