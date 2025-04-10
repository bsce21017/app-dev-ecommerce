import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const OrdersReceivedScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchSellerOrders = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setLoading(false);
                    return;
                }

                // Create a reference to the current seller's document
                const sellerRef = doc(db, 'seller', user.uid);

                // Query orders where sellerRefs array contains this sellerRef
                const q = query(
                    collection(db, 'orders'),
                    where('sellerRefs', 'array-contains', sellerRef),
                    // orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);

                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));

                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching seller orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, []);

    const renderOrderItem = ({ item }) => (
        <Pressable
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>ORDER #{item.id.substring(0, 8)}</Text>
                <View style={[
                    styles.statusBadge,
                    item.status === 'shipped' && styles.shippedStatus,
                    item.status === 'confirmed' && styles.confirmedStatus,
                    item.status === 'cancelled' && styles.cancelledStatus,
                    item.status === 'delivered' && styles.deliveredStatus
                ]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <Text style={styles.orderDate}>
                {item.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })}
            </Text>

            <View style={styles.orderItems}>
                {item.items.filter(item => item.sellerRef?.path === `sellers/${auth.currentUser?.uid}`)
                    .map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Icon name="cube" size={14} color="#E7C574" style={styles.itemIcon} />
                            <Text style={styles.itemText}>Product ID: {item.productRef.id}</Text>
                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                        </View>
                    ))
                }
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.customerName}>
                    Customer: {item.shippingDetails.name}
                </Text>
                <Text style={styles.totalAmount}>
                    PKR {item.items
                        .filter(item => item.sellerRef?.path === `sellers/${auth.currentUser?.uid}`)
                        .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        .toFixed(2)}
                </Text>
            </View>
        </Pressable>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E7C574" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#E7C574" />
                </Pressable>
                <Text style={styles.screenTitle}>ORDERS RECEIVED</Text>
                <FontAwesome5 name="store" size={20} color="#E7C574" />
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="box-open" size={50} color="#E7C574" />
                    <Text style={styles.emptyText}>No orders received yet</Text>
                    <Text style={styles.emptySubtext}>Your product orders will appear here</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        paddingHorizontal: 5,
    },
    backButton: {
        padding: 8,
    },
    screenTitle: {
        color: '#E7C574',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    orderCard: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderNumber: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        color: '#888',
        fontSize: 12,
        marginBottom: 15,
    },
    orderItems: {
        marginBottom: 15,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemIcon: {
        marginRight: 10,
    },
    itemText: {
        color: '#FFF',
        fontSize: 14,
        flex: 1,
    },
    itemQty: {
        color: '#888',
        fontSize: 14,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    confirmedStatus: {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
    },
    shippedStatus: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    cancelledStatus: {
        backgroundColor: 'rgba(198, 40, 40, 0.2)',
    },
    deliveredStatus: {
        backgroundColor: 'rgba(0, 123, 143, 0.2)',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    customerName: {
        color: '#888',
        fontSize: 14,
    },
    totalAmount: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#E7C574',
        fontSize: 18,
        marginTop: 15,
        fontWeight: 'bold',
    },
    emptySubtext: {
        color: '#888',
        fontSize: 14,
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default OrdersReceivedScreen;
