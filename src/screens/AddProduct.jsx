import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet, Image, FlatList, Alert, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from 'react-native-image-picker';
import { collection, doc, getDocs, serverTimestamp, addDoc } from 'firebase/firestore';
import axios from 'axios';
import ImageResizer from '@bam.tech/react-native-image-resizer';

import MultiSelectInput from './../components/MultiSelectInput';
import { auth, db } from "./../../firebaseConfig"

const AddProduct = ({ navigation }) => {
  // const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]);

  const categoryOptions = [
    { value: 'tools', label: 'Tools' },
    { value: 'calligraphy', label: 'Calligraphy' },
    { value: 'painting', label: 'Painting' },
    { value: 'testing', label: 'Testing' }
  ];

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [products, setProducts] = useState(0);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    sales: 0,
    availability: true,
    stock: 0,
    description: "",
  });

  const IMGBB_API_KEY = '154d0923e02aa6b645443b5e26257bab';

  const compressImage = async (uri) => {
    try {
      const result = await ImageResizer.resize({
        uri,
        width: 1200,
        height: 1200,
        compressFormat: 'JPEG',
        quality: 70,
        mode: 'contain'
      });
      return result.uri;
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      return uri;
    }
  };

  const uploadToImgBB = async (uri) => {
    try {
      const compressedUri = await compressImage(uri);

      const formData = new FormData();
      formData.append('image', {
        uri: compressedUri,
        type: 'image/jpeg',
        name: `product_${Date.now()}.jpg`,
      });

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      return response.data.data.url;
    } catch (error) {
      console.error('ImgBB upload error:', error);
      throw error;
    }
  };


  const importImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 8 - images.length,
      });

      if (result.assets?.length) {
        setLoading(true);
        setUploadProgress(0);

        const uploadedUrls = await Promise.all(
          result.assets.map(async (asset) => {
            try {
              return await uploadToImgBB(asset.uri);
            } catch (error) {
              console.error('Failed to upload one image:', error);
              return null;
            }
          })
        );

        setImages([...images, ...uploadedUrls.filter(url => url !== null)]);
        Alert.alert('Success', 'Images uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const enableSelection = () => {
    images.length < 8 ? importImage() : console.log("Maximum Images Selected")
  }



  const handleDraftPress = async () => {
    if (!product.name || !product.price || !product.category || images.length === 0 || product.stock === 0 || product.description === "") {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      const productData = {
        ...product,
        price: Number(product.price),
        images: images,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'seller', user.uid, 'products'), productData);

      Alert.alert("Success", "Product saved successfully");
      // Reset form
      setProduct({
        name: "",
        price: "",
        category: "",
        sales: 0,
        availability: true,
        stock: 0,
        description: "",
      });
      setImages([]);

      navigation.goBack()
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPress = async () => {
    if (!product.name || !product.price || !product.category || images.length === 0 || product.stock === 0 || product.description === "") {
      Alert.alert("Error", "Please fill all the required fields and add at least one image");
      return;
    }
    if (product.category === 'testing') {
      Alert.alert(
        'Publishing Restricted',
        'Products with "testing" category cannot be published.'
      );
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      const productData = {
        ...product,
        price: Number(product.price),
        images: images,
        createdAt: serverTimestamp(),
        sellerRef: doc(db, 'seller', user.uid),
        status: true,
      };

      await addDoc(collection(db, 'products', user.uid, 'published_products'), productData);

      Alert.alert("Success", "Product saved successfully");
      // Reset form
      setProduct({
        name: "",
        price: "",
        category: "",
        sales: 0,
        stock: 0,
        description: "",
        availability: true,
      });
      setImages([]);

      navigation.goBack()
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#F0C14B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Product</Text>
        <View style={styles.headerRight} />
      </View>


      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.section}>
          <Text style={styles.label}>Product Image ({images.length}/8) *</Text>

          {images.length > 0 && (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={enableSelection}>
              <FlatList
                scrollEnabled={false}
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

        {uploadProgress > 0 && uploadProgress < 100 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: 'gray', fontSize: 12 }}>
              Uploading: {uploadProgress}%
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${uploadProgress}%` }
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Product Name (English) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor="gray"
            onChangeText={(value) => setProduct({ ...product, name: value })}
          />

          <Text style={styles.label}>Price *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter product price"
            placeholderTextColor="gray"
            onChangeText={(value) => setProduct({ ...product, price: value })}

          />

          <Text style={styles.label}>Stock *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stock quantity"
            placeholderTextColor="gray"
            onChangeText={(value) => setProduct({ ...product, stock: value })}

          />

          <Text style={styles.label}>Category *</Text>
          <MultiSelectInput
            options={categoryOptions}
            selectedValue={product.category}
            onValueChange={(value) => setProduct({ ...product, category: value })}
            placeholder="Category"
            placeholderTextColor="gray"
            style={styles.input}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            placeholderTextColor="gray"
            onChangeText={(value) => setProduct({ ...product, description: value })}

          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Availability</Text>
            <Switch
              value={product.availability}
              onValueChange={(value) => setProduct({ ...product, availability: value })}
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.draftButton} onPress={handleDraftPress}>
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton} onPress={handlePublishPress}>
          <Text style={styles.publishButtonText}>Publish Product</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B0E13",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B0E13",
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0B0E13',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#F0C14B",
  },
  headerRight: {
    width: 24,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F0C14B",
    marginBottom: 0,
  },
  section: {
    marginTop: 0,
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    color: "gray",
    marginBottom: 4,
  },
  imagePlaceholder: {
    minHeight: 100, // Ensure it has a minimum height
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: 5,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: '#0B0E13',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
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
  progressContainer: {
    height: 5,
    backgroundColor: '#333',
    marginTop: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#F0C14B',
  },
});

export default AddProduct;