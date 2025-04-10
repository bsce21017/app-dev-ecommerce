import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getFirestore(app);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setLoading(false);
                    return;
                }

                const customerRef = `customers/${user.uid}`;

                // Query orders where customerRef matches
                const q = query(
                    collection(db, 'orders'),
                    where('customerRef.path', '==', customerRef),
                    // Optional: order by creation date
                    // orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const ordersData = [];

                querySnapshot.forEach((doc) => {
                    ordersData.push({
                        id: doc.id,
                        ...doc.data(),
                        // Convert Firestore timestamp to JS Date
                        createdAt: doc.data().createdAt?.toDate() || new Date()
                    });
                });

                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const renderOrderItem = ({ item }) => (
        <Pressable
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id.substring(0, 8)}</Text>
                <Text style={styles.orderDate}>
                    {item.createdAt.toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.orderStatusContainer}>
                <Text style={[
                    styles.orderStatus,
                    item.status === 'shipped' && styles.shippedStatus,
                    item.status === 'confirmed' && styles.confirmedStatus
                ]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>PKR {item.total.toFixed(2)}</Text>
                <Icon name="chevron-right" size={16} color="#666" />
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
            <Text style={styles.screenTitle}>My Orders</Text>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="shopping-bag" size={50} color="#E7C574" />
                    <Text style={styles.emptyText}>No orders yet</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontWeight: 'bold',
        color: '#333',
    },
    orderDate: {
        color: '#666',
    },
    orderStatusContainer: {
        marginBottom: 12,
    },
    orderStatus: {
        color: '#E7C574',
        fontWeight: 'bold',
    },
    shippedStatus: {
        color: '#4CAF50',
    },
    confirmedStatus: {
        color: '#FF9800',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 12,
    },
    orderTotal: {
        fontWeight: 'bold',
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
});

export default OrdersScreen;