import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const CustomerSignIn = ({ navigation }) => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
             // Sign in the user
             const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
             const userId = userCredential.user.uid;
 
             // Check if this UID exists in the sellers collection
             const sellerDocRef = doc(db, 'seller', userId);
             const sellerDoc = await getDoc(sellerDocRef);
 
             if (sellerDoc.exists()) {
                 // If user is a seller, sign them out immediately
                 await signOut(auth);
                 Alert.alert(
                     'Access Denied', 
                     'Sellers must use the seller app to sign in. Please use the seller dashboard.'
                 );
                 return;
             }


            navigation.navigate('UserHome');
        } catch (error) {
            let errorMessage = 'Sign in failed. Please try again.';
            console.log(error.code); // Debug log
            
            if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Account temporarily disabled due to too many failed attempts';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>SIGN IN TO YOUR ACCOUNT</Text>

                <TextInput 
                    placeholder="Email" 
                    style={styles.input} 
                    placeholderTextColor="#888" 
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(value) => setForm({...form, email: value})}
                    autoCapitalize="none"
                />
                <TextInput 
                    placeholder="Password" 
                    style={styles.input} 
                    placeholderTextColor="#888" 
                    secureTextEntry 
                    value={form.password}
                    onChangeText={(value) => setForm({...form, password: value})}
                    autoCapitalize="none"
                />
                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.disabledButton]} 
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'PLEASE WAIT...' : 'SIGN IN'}
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
                    style={styles.signUpLink} 
                    onPress={() => navigation.navigate("CustomerSignUp")}
                >
                    <Text style={styles.signUpText}>
                        Don't have an account? <Text style={styles.signUpHighlight}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Reuse the same styles from SignUp with some additions
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
    signUpLink: {
        marginTop: 15,
    },
    signUpText: {
        color: 'gray',
        fontSize: 12,
    },
    signUpHighlight: {
        color: '#F0C14B',
        fontWeight: 'bold',
    },
});

export default CustomerSignIn;