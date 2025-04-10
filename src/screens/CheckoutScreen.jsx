import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, doc, setDocs, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { app, db } from '../../firebaseConfig';

const CheckoutScreen = ({ navigation, route }) => {
    const { cartItems, subtotal, shipping, total } = route.params;
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        // email: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
    const [loading, setLoading] = useState(false);

    const auth = getAuth(app);

    const handleCheckout = async () => {
        // Validate shipping details first
        if (!shippingDetails.name || !shippingDetails.address) {
            Alert.alert('Error', 'Please fill all required shipping details');
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            { console.log("document  refrence ", cartItems); }
            if (!user) throw new Error('User not logged in');

            const items = cartItems.map(item => ({
                productRef: doc(db, 'products', item.sellerId, 'published_products', item.id),
                quantity: item.quantity,
                sellerRef: item.sellerRef
            }));
            
            const uniqueSellerRefs = Array.from(
                new Set(items.map(item => item.sellerRef.path))
            ).map(path => doc(db, path));
            
            const orderData = {
                customerRef: doc(db, 'customers', user.uid),
                status: 'confirmed',
                items,
                sellerRefs: uniqueSellerRefs,
                shippingDetails,
                paymentMethod,
                subtotal,
                shipping,
                total,
                createdAt: new Date()
            };

            if (orderData.items.some(item => !item.sellerRef.path)) {
                throw new Error('Invalid seller references');
            }

            const orderRef = await addDoc(collection(db, 'orders'), orderData);

            const batch = writeBatch(db);
            const cartRef = collection(db, 'customers', user.uid, 'cart');
            const cartSnapshot = await getDocs(cartRef);

            cartSnapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            navigation.navigate('OrderConfirmation', { orderId: orderRef.id });

        } catch (error) {
            console.error('Full error object:', error);

            const errorMessage = error?.message
                ? error.message.includes('indexOf')
                    ? 'Invalid product data'
                    : error.message
                : 'An unexpected error occurred';

            Alert.alert('Checkout Failed', errorMessage);

        } finally {
            setLoading(false);
        }
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Shipping Details</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor={'darkgrey'}
                placeholder="Full Name"
                value={shippingDetails.name}
                onChangeText={(text) => setShippingDetails({ ...shippingDetails, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor={'darkgrey'}
                value={shippingDetails.address}
                onChangeText={(text) => setShippingDetails({ ...shippingDetails, address: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={shippingDetails.city}
                placeholderTextColor={'darkgrey'}
                onChangeText={(text) => setShippingDetails({ ...shippingDetails, city: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={shippingDetails.phone}
                placeholderTextColor={'darkgrey'}
                onChangeText={(text) => setShippingDetails({ ...shippingDetails, phone: text })}
            />

            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Pressable
                style={[styles.paymentOption, paymentMethod === 'cashOnDelivery' && styles.selectedPayment]}
                onPress={() => setPaymentMethod('cashOnDelivery')}
            >
                <Text style={styles.paymentText}>Cash on Delivery</Text>
            </Pressable>
            <Pressable
                style={[styles.paymentOption, paymentMethod === 'creditCard' && styles.selectedPayment]}
                onPress={() => setPaymentMethod('creditCard')}
            >
                <Text style={styles.paymentText}>Credit Card</Text>
            </Pressable>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Subtotal:</Text>
                    <Text style={styles.totalText}>PKR {subtotal}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Shipping:</Text>
                    <Text style={styles.totalText}>PKR {shipping}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalText}>PKR {total}</Text>
                </View>
            </View>

            <Pressable
                style={styles.checkoutButton}
                onPress={handleCheckout}
                disabled={loading}
            >
                <Text style={styles.checkoutButtonText}>
                    {loading ? 'Processing...' : 'Place Order'}
                </Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', padding: 16 },
    sectionTitle: { color: '#E7C574', fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    input: { backgroundColor: '#333', color: '#FFF', padding: 12, borderRadius: 5, marginBottom: 10 },
    paymentOption: { backgroundColor: '#333', padding: 15, borderRadius: 5, marginBottom: 10 },
    selectedPayment: { borderWidth: 1, borderColor: '#E7C574' },
    paymentText: { color: '#FFF' },
    summaryContainer: { backgroundColor: '#222', padding: 15, borderRadius: 5, marginVertical: 15 },
    summaryTitle: { color: '#E7C574', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    totalText: { fontWeight: 'bold', color: '#FFF' },
    checkoutButton: { backgroundColor: '#E7C574', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10, marginBottom: 30 },
    checkoutButtonText: { color: '#000', fontWeight: 'bold' }
});

export default CheckoutScreen;