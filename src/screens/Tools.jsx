import React from "react";
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tools = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tools</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Basic Functions</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.toolButton}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <Icon name="add-box" size={24} color="#F0C14B" />
            <Text style={styles.toolButtonText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <Icon name="receipt" size={24} color="#F0C14B" />
            <Text style={styles.toolButtonText}>Orders</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate("ProductList")}>
            <Icon name="list" size={24} color="#F0C14B" />
            <Text style={styles.toolButtonText}>Products</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F0C14B",
  },
  section: {
    marginTop: 16,
    // marginBottom: 16,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: "gray",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolButton: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "48%",
  },
  toolButtonText: {
    color: "#F0C14B",
    marginTop: 8,
  },
});

export default Tools;
