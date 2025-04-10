import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CustomerSignUp = ({ navigation }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        if (!form.name || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (form.password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            // Try to create new user
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);

            // Store additional user data in Firestore
            await setDoc(doc(db, 'customers', userCredential.user.uid), {
                name: form.name,
                email: form.email,
                createdAt: new Date(),
            });

            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('UserHome');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.error('Email already in use:', error);
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>SIGN UP TO OWN THE ART</Text>

                <TextInput
                    placeholder="Your Name"
                    style={styles.input}
                    placeholderTextColor="#888"
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, name: value })}
                />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, email: value })}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(value) => setForm({ ...form, password: value })}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.disabledButton]}
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'PLEASE WAIT...' : 'SIGN UP'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => navigation.navigate("UserHome")}
                    disabled={isLoading}
                >
                    <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signInLink}
                    onPress={() => navigation.navigate("CustomerSignIn")}
                >
                    <Text style={styles.signInText}>
                        Already have an account? <Text style={styles.signInHighlight}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        marginTop: 20,
        backgroundColor: '#F0C14B',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
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
        height: 50,
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
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    signInLink: {
        marginTop: 15,
    },
    signInText: {
        color: 'gray',
        fontSize: 12,
    },
    signInHighlight: {
        color: '#F0C14B',
        fontWeight: 'bold',
    },
});

export default CustomerSignUp;