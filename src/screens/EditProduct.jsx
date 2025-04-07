import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { launchImageLibrary } from 'react-native-image-picker';
import MultiSelectInput from './../components/MultiSelectInput';


const EditProduct = ({ route, navigation }) => {
    const { productId, isDraft } = route.params;
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: 0,
        status: '',
        category: '',
        images: [],
        availability: true
    });

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert('Error', 'No user logged in');
                    navigation.goBack();
                    return;
                }

                const productRef = isDraft
                    ? doc(db, 'seller', user.uid, 'products', productId)
                    : doc(db, 'products', user.uid, 'published_products', productId);

                const docSnap = await getDoc(productRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProduct({
                        name: data.name || '',
                        price: data.price ? data.price.toString() : '',
                        description: data.description || '',
                        stock: data.stock || 0,
                        category: data.category || '',
                        images: data.images || [],
                        availability: data.availability !== false,
                        status: data.status,
                    });
                } else {
                    Alert.alert('Error', 'Product not found');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Fetch error:', error);
                Alert.alert('Error', 'Failed to load product');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, isDraft]);

    const handleImageSelect = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 5 - product.images.length - newImages.length
            });

            if (result.assets) {
                setNewImages([...newImages, ...result.assets]);
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    const removeImage = (index, isNew) => {
        if (isNew) {
            setNewImages(newImages.filter((_, i) => i !== index));
        } else {
            setProduct({
                ...product,
                images: product.images.filter((_, i) => i !== index)
            });
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const user = auth.currentUser;
            if (!user) return;

            const updatedProduct = {
                ...product,
                price: parseFloat(product.price) || 0,
                stock: parseInt(product.stock) || 0,
                // Combine existing images with new ones (in a real app, you'd upload new images first)
                images: [...product.images, ...newImages.map(img => img.uri)]
            };

            const productRef = isDraft
                ? doc(db, 'seller', user.uid, 'products', productId)
                : doc(db, 'products', user.uid, 'published_products', productId);

            await setDoc(productRef, updatedProduct, { merge: true });
            Alert.alert('Success', 'Product updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        try {
            setPublishing(true);
            const user = auth.currentUser;
            if (!user) return;

            // 1. Create in published products
            const publishedRef = doc(db, 'products', user.uid, 'published_products', productId);
            await setDoc(publishedRef, {
                name: product.name,
                price: parseFloat(product.price) || 0,
                description: product.description,
                stock: parseInt(product.stock) || 0,
                category: product.category,
                images: [...product.images, ...newImages.map(img => img.uri)],
                availability: product.availability !== false,
                sellerRef: doc(db, 'seller', user.uid),
                status: product.status,
                createdAt: new Date()

            });

            // 2. Delete from drafts
            const draftRef = doc(db, 'seller', user.uid, 'products', productId);
            await deleteDoc(draftRef);

            Alert.alert('Success', 'Product published successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Publish error:', error);
            Alert.alert('Error', 'Failed to publish product');
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F0C14B" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Product Information</Text>

            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={product.name}
                onChangeText={(text) => setProduct({ ...product, name: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={product.price}
                onChangeText={(text) => setProduct({ ...product, price: text })}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description"
                multiline
                numberOfLines={3}
                value={product.description}
                onChangeText={(text) => setProduct({ ...product, description: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Stock Quantity"
                keyboardType="numeric"
                value={product.stock.toString()}
                onChangeText={(text) => setProduct({ ...product, stock: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Category"
                value={product.category}
                onChangeText={(text) => setProduct({ ...product, category: text })}
            />
            
            <MultiSelectInput
                options={statusOptions}
                selectedValue={product.status}
                onValueChange={(value) => setProduct({ ...product, status: value })}
                placeholder="Select status"
                style={styles.input}
            />

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Available for sale</Text>
                <TouchableOpacity
                    style={[
                        styles.switchButton,
                        product.availability && styles.switchButtonActive
                    ]}
                    onPress={() => setProduct({ ...product, availability: !product.availability })}
                >
                    <Text style={styles.switchText}>
                        {product.availability ? 'Yes' : 'No'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Product Images</Text>
            <View style={styles.imageContainer}>
                {[...product.images, ...newImages.map(img => img.uri)].map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => removeImage(index, index >= product.images.length)}
                        >
                            <Icon name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}
                {[...product.images, ...newImages].length < 5 && (
                    <TouchableOpacity style={styles.addImageButton} onPress={handleImageSelect}>
                        <Icon name="add" size={24} color="#F0C14B" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.buttonContainer}>
                {isDraft && (
                    <TouchableOpacity
                        style={[styles.button, styles.publishButton]}
                        onPress={handlePublish}
                        disabled={publishing}
                    >
                        {publishing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Publish Product</Text>
                        )}
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0E13',
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B0E13',
    },
    sectionTitle: {
        color: '#F0C14B',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    switchLabel: {
        color: 'white',
        fontSize: 16,
    },
    switchButton: {
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    switchButtonActive: {
        backgroundColor: '#F0C14B',
    },
    switchText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    imageWrapper: {
        width: 80,
        height: 80,
        marginRight: 10,
        marginBottom: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageButton: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#F0C14B',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    publishButton: {
        backgroundColor: '#4CAF50',
    },
    saveButton: {
        backgroundColor: '#F0C14B',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EditProduct;