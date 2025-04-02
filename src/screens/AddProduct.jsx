import React from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AddProduct = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Product Image (0/8) *</Text>
        <View style={styles.imagePlaceholder}>
          <Icon name="camera-alt" size={32} color="gray" />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Product Name (English) *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter product name" 
          placeholderTextColor="gray" 
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Availability</Text>
        <Switch value={true} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.draftButton}>
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Publish Product</Text>
        </TouchableOpacity>
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
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: "gray",
  },
  imagePlaceholder: {
    height: 96,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 8,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "white",
  },
  switchContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  draftButton: {
    backgroundColor: "#444",
    padding: 16,
    borderRadius: 12,
  },
  draftButtonText: {
    color: "#F0C14B",
  },
  publishButton: {
    backgroundColor: "#F0C14B",
    padding: 16,
    borderRadius: 12,
  },
  publishButtonText: {
    color: "black",
  },
});

export default AddProduct;
