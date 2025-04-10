import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from 'react-native-linear-gradient';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import axios from 'axios';
import { db, auth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SellerProfile = ({ navigation }) => {
    const [sellerData, setSellerData] = useState(null);
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const nav = navigation

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const sellerRef = doc(db, 'seller', user.uid);
                const sellerSnap = await getDoc(sellerRef);

                if (sellerSnap.exists()) {
                    const data = sellerSnap.data();
                    setSellerData({
                        ...data,
                        id: sellerSnap.id,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        profileImage: data.profileImage || null
                    });

                    const productsQuery = query(
                        collection(db, 'products', user.uid, 'published_products')
                    );
                    const productsSnapshot = await getDocs(productsQuery);
                    setProductsCount(productsSnapshot.size);
                }
            } catch (error) {
                console.error('Error fetching seller data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, []);

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

    const handleImageUpload = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });

            if (result.didCancel || !result.assets || result.assets.length === 0) return;

            const imageUri = result.assets[0].uri;
            const compressedUri = await compressImage(imageUri);
            const formData = new FormData();
            formData.append('image', {
                uri: compressedUri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });

            const imgbbApiKey = '154d0923e02aa6b645443b5e26257bab';
            const uploadResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = uploadResponse.data.data.url;

            const sellerRef = doc(db, 'seller', auth.currentUser.uid);
            await updateDoc(sellerRef, {
                profileImage: imageUrl
            });

            setSellerData(prev => ({ ...prev, profileImage: imageUrl }));
        } catch (error) {
            console.error('Image upload failed:', error);
            Alert.alert('Error', 'Failed to upload image');
        }
    };


    const calculateDaysActive = (createdAt) => {
        if (!createdAt) return 0;
        const createdDate = new Date(createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - createdDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            nav.reset({
                index: 0,
                routes: [{ name: 'SellerSignUp' }],
            });
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#F0C14B" />
                </View>
            </SafeAreaView>
        );
    }

    if (!sellerData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Seller data not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const daysActive = calculateDaysActive(sellerData.createdAt);
    const rating = sellerData.rating || 0; // Default to 0 if no rating exists

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <LinearGradient
                    colors={['#1E293B', '#0B0E13']}
                    style={styles.profileHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={
                                sellerData.profileImage
                                    ? { uri: sellerData.profileImage }
                                    : require("./../../assets/frame.png")
                            }
                            style={styles.avatar}
                        />
                        {loading && <ActivityIndicator size="small" color="#F0C14B" />}
                        {/* <Icon name="camera" size={24} color="#F0C14B" style={{ position: 'absolute', bottom: 10, right: 10 }} />     */}

                        <TouchableOpacity style={styles.editIcon} onPress={handleImageUpload}>
                            <Icon name="pencil" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name}>{sellerData.businessName}</Text>
                    <Text style={styles.subtext}>Seller ID:</Text>
                    <Text style={styles.subtext}>{sellerData.id}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{daysActive}</Text>
                            <Text style={styles.statLabel}>Days</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{productsCount}</Text>
                            <Text style={styles.statLabel}>Products</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    {[
                        { icon: 'cog', title: 'Account Settings' },
                        { icon: 'translate', title: 'Language' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <Icon name={item.icon} size={22} color="#F0C14B" />
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Icon name="chevron-right" size={22} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    {[
                        { icon: 'chat', title: 'Live Chat' },
                        { icon: 'email', title: 'Contact Us' },
                        // { icon: 'help-circle', title: 'Help Center' },
                        { icon: 'information', title: 'About' },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <Icon name={item.icon} size={22} color="#F0C14B" />
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Icon name="chevron-right" size={22} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View> */}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" size={20} color="#D9534F" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0F172A",
    },
    scrollContent: {
        paddingBottom: 30,
    },
    profileHeader: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#F0C14B',
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#333",
        borderRadius: 12,
        padding: 5,
        borderWidth: 2,
        borderColor: '#0F172A',
    },
    name: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtext: {
        color: "#94A3B8",
        fontSize: 14,
        marginBottom: -10,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: "#F0C14B",
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: "#94A3B8",
        fontSize: 12,
        marginTop: 4,
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickAction: {
        alignItems: 'center',
        width: (width - 48) / 3,
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        color: '#E2E8F0',
        fontSize: 12,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#F0C14B",
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featureItem: {
        width: (width - 64) / 3,
        alignItems: 'center',
        marginBottom: 16,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        color: '#E2E8F0',
        fontSize: 12,
        textAlign: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    menuText: {
        color: "#fff",
        fontSize: 15,
        marginLeft: 12,
        flex: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 7,
        borderRadius: 8,
        width: '90%',
        borderWidth: 1,
        borderColor: '#D9534F',
        marginTop: 8,
    },
    logoutText: {
        color: "#D9534F",
        fontWeight: "600",
        marginLeft: 8,
    },
});

export default SellerProfile;