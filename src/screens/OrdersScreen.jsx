import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, orderBy } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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

                const customerRef = doc(db, 'customers', user.uid);
                const q = query(
                    collection(db, 'orders'),
                    where('customerRef', '==', customerRef),
                    orderBy('createdAt', 'desc')
                );

                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }));
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
                <View>
                    <Text style={styles.orderNumber}>ORDER #{item.id.substring(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                        {item.createdAt.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, 
                    item.status === 'shipped' && styles.shippedStatus,
                    item.status === 'confirmed' && styles.confirmedStatus,
                    item.status === 'cancelled' && styles.cancelledStatus,
                    item.status === 'delivered' && styles.deliveredStatus
                ]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>PKR {item.total.toFixed(2)}</Text>
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
                <Text style={styles.screenTitle}>MY ORDERS</Text>
                <FontAwesome5 name="shopping-bag" size={20} color="#E7C574" />
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <FontAwesome5 name="box-open" size={50} color="#E7C574" />
                    <Text style={styles.emptyText}>No orders yet</Text>
                    <Text style={styles.emptySubtext}>Your orders will appear here</Text>
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
        marginBottom: 15,
    },
    orderNumber: {
        color: '#E7C574',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    orderDate: {
        color: '#888',
        fontSize: 12,
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 5,
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
    totalLabel: {
        color: '#888',
        fontSize: 14,
    },
    totalValue: {
        color: '#E7C574',
        fontSize: 18,
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

export default OrdersScreen;