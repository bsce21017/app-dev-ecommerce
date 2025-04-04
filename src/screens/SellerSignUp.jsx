import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SellerSignUp = ({ navigation }) => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        businessName: '',
    })

    // const setCustomClaim = async (uid) => {
    //     // const auth = getAuth();
    //     await auth.setCustomUserClaims(uid, {
    //         role: 'seller',
    //     });
    // };

    const handleSubmit = async () => {
        try {
            // const auth = getAuth();
            const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

            // await setCustomClaim(userCred.user.uid);

            // const db = getFirestore();
            await setDoc(doc(db, 'seller', userCred.user.uid), {
                businessName: form.businessName,
                approved: false,
                email: form.email,
                createdAt: new Date()
            });

            Alert.alert('Success','Seller registered!');
        } catch (error) {
            // console.error('Signup failed:', error);
            Alert.alert(error.name, error.code);

        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>SIGN UP TO OWN THE ART</Text>

                <TextInput placeholder="Store Name" style={styles.input} placeholderTextColor="#888" value={form.businessName} onChangeText={(value) => setForm({ ...form, businessName: value })} />
                <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#888" keyboardType="email-address" value={form.email} onChangeText={(value) => setForm({ ...form, email: value })} />
                <TextInput placeholder="Password" style={styles.input} placeholderTextColor="#888" secureTextEntry value={form.password} onChangeText={(value) => setForm({ ...form, password: value })} />
                <TextInput placeholder="Category" style={styles.input} placeholderTextColor="#888" />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
        fontSize: 11,
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
        marginTop: 20,
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
