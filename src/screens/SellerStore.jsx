import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconA from 'react-native-vector-icons/FontAwesome';

const SellerStore = ({ navigation }) => {
  const products = [...Array(6)].map((_, i) => ({
    id: i.toString(),
    name: `Product ${i + 1}`,
    sales: Math.floor(Math.random() * 50) + 1,
    image: require("./../../assets/frame.png")
  }));

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Store</Text>
          
          <Pressable>
            <Icon name="settings" size={24} color="#F0C14B" />
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>46</Text>
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
              <TouchableOpacity key={index} style={styles.orderItem}>
                <IconA name={item.icon} size={24} color="#F0C14B" />
                <Text style={styles.orderText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.optionsContainer}>
            {storeOptions.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionItem}>
                <Text style={styles.optionText}>{option}</Text>
                <Icon name="chevron-right" size={20} color="#F0C14B" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.addProductButton}>
          <Text style={styles.addProductText}>ADD NEW PRODUCT</Text>
          <Icon name="add-circle" size={24} color="#F0C14B" />
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.productGrid}>
            {products.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image source={product.image} style={styles.productImage} />
                <Text style={styles.salesText}>{product.sales} SALES</Text>
                <Text style={styles.itemName}>{product.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
});

export default SellerStore;