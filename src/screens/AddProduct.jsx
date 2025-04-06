import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, StyleSheet, Image, FlatList, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from 'react-native-image-picker';
import { collection, doc, getDocs, serverTimestamp, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';
import { auth, db } from "./../../firebaseConfig"

const AddProduct = () => {
  // const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]);
  const [products, setProducts] = React.useState(0);
  const [product, setProduct] = React.useState({
    name: "",
    price: "",
    category: "",
    sales: 0,
    availability: true,
  });

  const fetchSellerProducts = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('No user is signed in');
        return;
      }

      const productsCollectionRef = collection(db, 'seller', user.uid, 'products');
      const querySnapshot = await getDocs(productsCollectionRef);

      if (!querySnapshot.empty) {
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // console.log('Fetched products:', productsList.length);
        setProducts(productsList.length);
      } else {
        console.log('No products found for this seller');
      }
    } catch (err) {
      console.error('Full error:', err); 
      if (err.code === 'permission-denied') {
        setError('You don\'t have permission to view this data');
      } else {
        setError('Failed to fetch products');
      }
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

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

  const handleDraftPress = async () => {
    if (!product.name || !product.price || !product.category || images.length === 0) {
      Alert.alert("Error", "Please fill all the required fields and add at least one image");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      // 1. Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${image.fileName}`);
          await uploadBytes(storageRef, image);
          return await getDownloadURL(storageRef);
        })
      );

      // 2. Add product document to Firestore
      const productData = {
        ...product,
        price: Number(product.price), // Convert string to number
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "draft",
        sellerId: user.uid
      };

      const docRef = await addDoc(
        collection(db, 'seller', user.uid, 'products'), 
        productData
      );

      Alert.alert("Success", "Product saved as draft");
      console.log("Product added with ID: ", docRef.id);
      
      // Reset form after successful submission
      setProduct({
        name: "",
        price: "",
        category: "",
        sales: 0,
        availability: false,
      });
      setImages([]);

    } catch (error) {
      console.error("Error adding product: ", error);
      Alert.alert("Error", "Failed to save product");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublishPress = () => {

    // console.log("Product Published")
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

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

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="gray"
          onChangeText={(value) => setProduct({ ...product, category: value })}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Availability</Text>
        <Switch
          value={product.availability}
          onValueChange={(value) => setProduct({ ...product, availability: value })}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.draftButton} onPress={handleDraftPress}>
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