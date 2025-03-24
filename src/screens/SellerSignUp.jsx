import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const SellerSignUp = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>SIGN UP TO OWN THE ISLAMIC ART</Text>

                <TextInput placeholder="Store Name" style={styles.input} placeholderTextColor="#888" />
                <TextInput placeholder="Seller's Name" style={styles.input} placeholderTextColor="#888" />
                <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#888" keyboardType="email-address" />
                <TextInput placeholder="Password" style={styles.input} placeholderTextColor="#888" secureTextEntry />
                <TextInput placeholder="Category" style={styles.input} placeholderTextColor="#888" />

                <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SellerSignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0E13',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '85%',
        borderColor: '#F0C14B',
        borderWidth: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F0C14B',
    },
    subtitle: {
        color: 'gray',
        fontSize: 10,
        marginBottom: 20,
        textAlign: "center",

    },
    button: {
        backgroundColor: '#F0C14B',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        backgroundColor: '#222',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
    },
    orText: {
        color: 'gray',
        marginVertical: 10,
    },
    googleButton: {
        backgroundColor: '#F0C14B',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    googleButtonText: {
        fontWeight: 'bold',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#F0C14B',
        // padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        fontWeight: 'bold',
        color: '#000',
    },
});
