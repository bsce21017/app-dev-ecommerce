import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProductList = () => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Wireless Headphones",
      image: require("./../../assets/frame.png"),
      price: "$50",
      stock: 10,
    },
    {
      id: "2",
      name: "Smart Watch",
      image: require("./../../assets/frame.png"),
      price: "$120",
      stock: 5,
    },
    {
      id: "3",
      name: "Gaming Mouse",
      image: require("./../../assets/frame.png"),
      price: "$35",
      stock: 20,
    },
  ]);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <Text style={styles.productStock}>Stock: {item.stock}</Text>
      <TouchableOpacity style={styles.editButton}>
        <Icon name="edit" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Icon name="inventory" size={64} color="gray" />
          <Text style={styles.noDataText}>No more data</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productName: {
    color: "white",
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  productPrice: {
    color: "#F0C14B",
    fontSize: 14,
  },
  productStock: {
    color: "gray",
    fontSize: 12,
  },
  editButton: {
    backgroundColor: "#F0C14B",
    padding: 8,
    borderRadius: 6,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "gray",
    fontSize: 16,
    marginTop: 16,
  },
});

export default ProductList;
