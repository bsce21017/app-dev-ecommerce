import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { db, auth, WEB_CLIENT_ID } from "../../firebaseConfig"
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const CustomerSignIn = ({navigation}) => {
    // useEffect(() => {WEB_CLIENT_ID
    //     GoogleSignin.configure({
    //         web
    //     })
    // })

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>SIGN UP TO OWN THE ART</Text>

                <TextInput placeholder="Your Name" style={styles.input} placeholderTextColor="#888" />
                <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#888" keyboardType="email-address" />
                <TextInput placeholder="Password" style={styles.input} placeholderTextColor="#888" secureTextEntry />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("UserHome")}>
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                <TouchableOpacity style={styles.googleButton} onPress={() => navigation.navigate("UserHome")}>
                    <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomerSignIn;

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
        // padding: 12,
        borderRadius: 8,
        // marginVertical: 20,
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
        height: '11%',
    },
    orText: {
        color: 'gray',
        marginVertical: 10,
    },
    googleButton: {
        backgroundColor: '#F0C14B',
        padding: 2,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    googleButtonText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
});
