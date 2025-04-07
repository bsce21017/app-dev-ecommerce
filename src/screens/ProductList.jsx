import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("drafts"); // 'drafts' or 'published'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("No user logged in");
          setLoading(false);
          return;
        }

        if (activeTab === "drafts") {
          // Fetch draft products from /seller/{userId}/products
          const draftsRef = collection(db, "seller", user.uid, "products");
          const draftsSnapshot = await getDocs(draftsRef);
          const drafts = draftsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isDraft: true,
            status: "draft"
          }));
          setProducts(drafts);
        } else {
          // Fetch published products from /products/{userId}/published_products
          const publishedRef = collection(db, "products", user.uid, "published_products");
          const publishedSnapshot = await getDocs(publishedRef);
          const published = publishedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isDraft: false,
            status: "published"
          }));
          setProducts(published);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchProducts);
    fetchProducts();
    return unsubscribe;
  }, [navigation, activeTab]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate("EditProduct", { 
        productId: item.id,
        isDraft: item.isDraft 
      })}
    >
      <Image 
        source={item.images?.[0] ? { uri: item.images[0] } : require("./../../assets/frame.png")}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.productStock}>Stock: {item.stock || 0}</Text>
          <Text style={[
            styles.statusBadge,
            item.status === 'draft' ? styles.draftBadge : styles.publishedBadge
          ]}>
            {item.status || 'draft'}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProduct", { 
          productId: item.id,
          isDraft: item.isDraft 
        })}
      >
        <Icon name="edit" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F0C14B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#F0C14B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'drafts' && styles.activeTab
          ]}
          onPress={() => setActiveTab('drafts')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'drafts' && styles.activeTabText
          ]}>
            My Drafts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'published' && styles.activeTab
          ]}
          onPress={() => setActiveTab('published')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'published' && styles.activeTabText
          ]}>
            Published
          </Text>
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Icon 
            name={activeTab === 'drafts' ? "drafts" : "inventory"} 
            size={64} 
            color="gray" 
          />
          <Text style={styles.noDataText}>
            {activeTab === 'drafts' 
              ? "No drafts found" 
              : "No published products found"}
          </Text>
          {activeTab === 'drafts' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddProduct")}
            >
              <Text style={styles.addButtonText}>Add New Draft</Text>
            </TouchableOpacity>
          )}
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
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#F0C14B',
  },
  tabText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#F0C14B',
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
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    color: "#F0C14B",
    fontSize: 14,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productStock: {
    color: "gray",
    fontSize: 12,
  },
  statusBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  draftBadge: {
    backgroundColor: '#555',
    color: '#ccc',
  },
  publishedBadge: {
    backgroundColor: '#2e7d32',
    color: 'white',
  },
  editButton: {
    backgroundColor: "#F0C14B",
    padding: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0E13",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0E13",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
    marginVertical: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#F0C14B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    color: "gray",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#F0C14B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default ProductList;