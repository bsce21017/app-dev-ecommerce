import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet, Image, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = () => {
  const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]);

  const importImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 8 - images.length,
        // includeBase64: true // Optional: if you need base64 data
      });

      if (!result.didCancel && result.assets) {
        setImages(prevImages => [...prevImages, ...result.assets]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const enableSelection = () => {
    images.length < 8 ? importImage() : console.log("Maximum Images Selected")
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Product Image ({images.length}/8) *</Text>

        {images.length > 0 && (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={enableSelection}>
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              numColumns={4}
              columnWrapperStyle={styles.imageGrid}
              renderItem={({ item, index }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.selectedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icon name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </TouchableOpacity>
        )}

        {images.length == 0 && (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={importImage}>
            <Icon name="camera-alt" size={32} color="gray" />
            <Text style={styles.placeholderText}>Add Images</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Product Name (English) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor="gray"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product price"
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Availability</Text>
        <Switch
          value={availability}
          onValueChange={() => setAvailability(!availability)}
        />
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
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: "gray",
    marginBottom: 8,
  },
  imagePlaceholder: {
    height: 'auto',
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "gray",
    // marginTop: 8,
  },
  imageGrid: {
    // marginRight: 10,
    justifyContent: 'space-between',
    // marginBottom: 8,
    marginTop: 8,
  },
  imageContainer: {
    width: '23%', // 4 images per row with small gap
    aspectRatio: 1,
    // marginBottom: 8,
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    // marginTop: 8,
    color: "white",
  },
  switchContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  draftButton: {
    backgroundColor: "#444",
    padding: 5,
    borderRadius: 25,
    flex: 1,
    height: 50,
    marginRight: 8,
  },
  draftButtonText: {
    color: "#F0C14B",
    textAlign: 'center',
  },
  publishButton: {
    backgroundColor: "#F0C14B",
    padding: 5,
    borderRadius: 25,
    flex: 1,
    height: 50,
    marginLeft: 8,
  },
  publishButtonText: {
    color: "black",
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddProduct;