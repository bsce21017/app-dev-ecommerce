import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>DIVE INTO THE ISLAMIC ART</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CustomerSignUp')}>
          <Text style={styles.buttonText}>CONTINUE AS A CUSTOMER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SellerSignIn')}>
          <Text style={styles.buttonText}>CONTINUE AS A SELLER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;

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
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: '#F0C14B',
    padding: 12,
    borderRadius: 8,
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});
