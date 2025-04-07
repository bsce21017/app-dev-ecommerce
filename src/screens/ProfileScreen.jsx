import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from "./../../firebaseConfig";

const ProfileScreen = ({ navigation }) => {
  const [error, setError] = useState(false);
  const [name, setName] = useState('');

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('No user is signed in');
        return;
      }

      // Fetch seller profile
      const userDoc = await getDoc(doc(db, 'customers', user.uid));
      if (userDoc.exists()) {
        console.log("User data:", userDoc.data());
        setName(userDoc.data().name);
      } else {
        setError('No seller document found');
      }


    } catch (err) {
      console.error("Fetch error:", err);
      setError('Failed to load store data');
    }
  };

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', fetchUserData);
      fetchUserData();
      return unsubscribe;
    }, [navigation]);

  const wishlistItems = [
    { id: "1", name: "Calligraphy Set", price: 560, image: require('./../../assets/sun.png') },
    { id: "2", name: "Art Book", price: 340, image: require('./../../assets/sun.png') },
    { id: "3", name: "Pen", price: 120, image: require('./../../assets/sun.png') },
    { id: "4", name: "Water Colors", price: 220, image: require('./../../assets/sun.png') },
    { id: "5", name: "Example", price: 450, image: require('./../../assets/sun.png') },
    { id: "6", name: "Example", price: 180, image: require('./../../assets/sun.png') },
  ];

  const renderWishlistItem = ({ item }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail')}
    >
      <View style={styles.productImageContainer}>
        <Image style={styles.productImage} source={item.image} resizeMode='contain' />
        <Text style={styles.productPrice}>PKR {item.price}</Text>
      </View>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
    </Pressable>
  );

  const orderStatusItems = [
    { icon: "credit-card", label: "To Pay" },
    { icon: "truck", label: "To Ship" },
    { icon: "download", label: "To Receive" },
    { icon: "star", label: "To Review" },
    { icon: "undo", label: "Returns" },
  ];

  const appFeatures = [
    { icon: "heart", label: "WISHLIST" },
    { icon: "clock-o", label: "THE ITEMS YOU VIEWED" },
    { icon: "comments", label: "YOUR COMMENTS" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileName}>{name || "Your Name"}</Text>
            <Pressable>
              <Icon name="gear" size={20} color="#E7C574" />
            </Pressable>
          </View>

          <View style={styles.profileTabs}>
            <Pressable style={styles.profileTab}>
              <Text style={styles.profileTabText}>WISHLIST</Text>
            </Pressable>
            <View style={styles.tabDivider} />
            <Pressable style={styles.profileTab}>
              <Text style={styles.profileTabText}>FOLLOWING</Text>
            </Pressable>
            <View style={styles.tabDivider} />
            <Pressable style={styles.profileTab}>
              <Text style={styles.profileTabText}>REVIEWS</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MY ORDERS</Text>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Orders</Text>
              <Icon name="arrow-right" size={16} color="#E7C574" />
            </Pressable>
          </View>

          <View style={styles.orderStatusContainer}>
            {orderStatusItems.map((item, index) => (
              <Pressable key={index} style={styles.orderStatusItem}>
                <Icon name={item.icon} size={32} color="#FFF" />
                <Text style={styles.orderStatusLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOW TO USE THE APP</Text>
          <View style={styles.featuresContainer}>
            {appFeatures.map((item, index) => (
              <Pressable key={index} style={styles.featureItem}>
                <View style={styles.featureIconText}>
                  <Icon name={item.icon} size={16} color="#FFF" />
                  <Text style={styles.featureText}>{item.label}</Text>
                </View>
                <Icon name="arrow-right" size={16} color="#FFF" />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <FlatList
            data={wishlistItems}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.wishlistContainer}
          />
        </View>
      </ScrollView>
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
    padding: 16,
    paddingTop: 10,
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 16,
  },
  profileName: {
    color: '#E7C574',
    fontSize: 28,
    fontFamily: 'Pacifico',
  },
  profileTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 8,
  },
  profileTab: {
    paddingHorizontal: 8,
  },
  profileTabText: {
    color: '#E7C574',
    fontSize: 8,
    fontFamily: 'Pacifico',
  },
  tabDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#636363',
    marginHorizontal: 8,
  },
  section: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#636363',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#E7C574',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#E7C574',
    fontSize: 9,
    marginRight: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  orderStatusItem: {
    alignItems: 'center',
    width: '20%',
  },
  orderStatusLabel: {
    color: '#FFF',
    fontSize: 9,
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    marginTop: 0,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  featureIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: '#FFF',
    fontSize: 10,
    marginLeft: 8,
  },
  wishlistContainer: {
    // paddingTop: 8,
  },
  productCard: {
    width: '32%',
    marginBottom: 16,
    marginHorizontal: 2,
  },
  productImageContainer: {
    backgroundColor: '#E7C574',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    // height: 120,
    justifyContent: 'space-between',
  },
  productImage: {
    width: '100%',
    height: 60,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  productName: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProfileScreen;

