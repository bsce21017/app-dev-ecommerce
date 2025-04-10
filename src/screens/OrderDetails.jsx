import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderDetailsScreen = ({ route }) => {
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productNames, setProductNames] = useState([]);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderRef = doc(db, 'orders', orderId);
                const orderSnap = await getDoc(orderRef);

                if (orderSnap.exists()) {
                    const data = orderSnap.data();
                    const formattedData = {
                        ...data,
                        id: orderSnap.id,
                        createdAt: data.createdAt?.toDate() || new Date(),
                    };
                    setOrder(formattedData);

                    const productTitles = await Promise.all(
                        data.items.map(async (item) => {
                            try {
                                const productSnap = await getDoc(item.productRef);
                                return productSnap.exists() ? productSnap.data().name : 'Unknown Product';
                            } catch (err) {
                                return 'Error fetching product';
                            }
                        })
                    );

                    setProductNames(productTitles);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleCancelOrder = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const orderRef = doc(db, 'orders', orderId);
                            await getDoc(orderRef).then((snap) => {
                                if (snap.exists() && snap.data().status !== 'cancelled') {
                                    order.status = 'cancelled';
                                    setOrder({ ...order });
                                }
                            });
                        } catch (error) {
                            console.error('Cancel error:', error);
                        }
                    }
                }
            ]
        );
    };

    const handleReturnOrder = () => {
        Alert.alert(
            'Return Order',
            'Do you want to request a return?',
            [
                { text: 'No' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        Alert.alert('Return requested (placeholder)');
                    }
                }
            ]
        );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'shipped': return styles.shippedBadge;
            case 'confirmed': return styles.confirmedBadge;
            case 'cancelled': return styles.cancelledBadge;
            case 'delivered': return styles.deliveredBadge;
            default: return styles.defaultBadge;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E7C574" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Order not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>ORDER DETAILS</Text>
                <Text style={styles.orderNumber}>#{order.id.substring(0, 8)}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, getStatusStyle(order.status)]}>
                        {order.status.toUpperCase()}
                    </Text>
                    <Text style={styles.dateText}>
                        {order.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ITEMS</Text>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemIcon}>
                                <Icon name="cube" size={16} color="#E7C574" />
                            </View>
                            <Text style={styles.itemName}>{productNames[index]}</Text>
                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SHIPPING</Text>
                    <View style={styles.infoRow}>
                        <Icon name="user" size={14} color="#E7C574" style={styles.infoIcon} />
                        <Text style={styles.infoText}>{order.shippingDetails.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="map-marker" size={14} color="#E7C574" style={styles.infoIcon} />
                        <Text style={styles.infoText}>{order.shippingDetails.address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="phone" size={14} color="#E7C574" style={styles.infoIcon} />
                        <Text style={styles.infoText}>{order.shippingDetails.phone}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PAYMENT</Text>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentMethod}>
                            {order.paymentMethod === 'cashOnDelivery' 
                                ? 'Cash on Delivery' 
                                : 'Credit Card'}
                        </Text>
                        <View style={styles.priceSummary}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Subtotal:</Text>
                                <Text style={styles.priceValue}>PKR {order.subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Shipping:</Text>
                                <Text style={styles.priceValue}>PKR {order.shipping.toFixed(2)}</Text>
                            </View>
                            <View style={[styles.priceRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>PKR {order.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {(order.status === 'confirmed' || order.status === 'shipped') && (
                <Pressable 
                    style={styles.cancelButton}
                    onPress={handleCancelOrder}
                >
                    <Text style={styles.buttonText}>Cancel Order</Text>
                </Pressable>
            )}

            {order.status === 'delivered' && (
                <Pressable 
                    style={styles.returnButton}
                    onPress={handleReturnOrder}
                >
                    <Text style={styles.buttonText}>Request Return</Text>
                </Pressable>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        color: '#E7C574',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    orderNumber: {
        color: '#888',
        fontSize: 14,
        marginTop: 4,
    },
    card: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    shippedBadge: { backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50' },
    confirmedBadge: { backgroundColor: 'rgba(255, 152, 0, 0.2)', color: '#FF9800' },
    cancelledBadge: { backgroundColor: 'rgba(198, 40, 40, 0.2)', color: '#C62828' },
    deliveredBadge: { backgroundColor: 'rgba(0, 123, 143, 0.2)', color: '#007B8F' },
    defaultBadge: { backgroundColor: 'rgba(238, 238, 238, 0.2)', color: '#EEE' },
    dateText: {
        color: '#888',
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(231, 197, 116, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    itemName: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
    },
    itemQty: {
        color: '#888',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#222',
        marginVertical: 0,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoIcon: {
        marginRight: 10,
        width: 20,
    },
    infoText: {
        color: '#FFF',
        fontSize: 14,
        flex: 1,
    },
    paymentRow: {
        flexDirection: 'row',
    },
    paymentMethod: {
        color: '#E7C574',
        fontSize: 14,
        fontWeight: 'bold',
        width: 120,
    },
    priceSummary: {
        flex: 1,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    priceLabel: {
        color: '#888',
        marginRight: 10,
        fontSize: 14,
    },
    priceValue: {
        color: '#FFF',
        fontSize: 14,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    totalLabel: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
        // marginRight: 30,
    },
    totalValue: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'rgba(198, 40, 40, 0.2)',
        padding: 7,
        marginBottom: 25,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C62828',
    },
    returnButton: {
        backgroundColor: 'rgba(231, 197, 116, 0.2)',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E7C574',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    errorText: {
        color: '#888',
        fontSize: 18,
    },
});

export default OrderDetailsScreen;