import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const OrderConfirmation = ({ navigation, route }) => {
  const { orderId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.successText}>Order Placed Successfully!</Text>
      <Text style={styles.orderId}>Order ID: {orderId}</Text>
      
      <Pressable 
        style={styles.button}
        onPress={() => navigation.navigate('UserHome')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
      
      <Pressable 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('OrderDetails', { orderId })}
      >
        <Text style={styles.secondaryButtonText}>View Order Details</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successIcon: { fontSize: 72, color: '#4CAF50', marginBottom: 20 },
  successText: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  orderId: { fontSize: 16, color: '#AAA', marginBottom: 30 },
  button: { backgroundColor: '#E7C574', padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#000', fontWeight: 'bold' },
  secondaryButton: { padding: 15, borderRadius: 5, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#E7C574' },
  secondaryButtonText: { color: '#E7C574', fontWeight: 'bold' }
});

export default OrderConfirmation;