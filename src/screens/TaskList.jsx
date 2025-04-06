import React, { useState, useEffect ,useLayoutEffect} from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { 
  collection, 
  doc, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  addDoc, 
  updateDoc,
  query
} from 'firebase/firestore';
import { db } from './../../firebaseConfig';

const image2 = require('./../../assets/arrow.png');

const SellerChatScreen = ({ navigation,route }) => {
  const { chatId, userName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

// Get references to Firestore collections
const chatRef = doc(db, 'chats', chatId);
const messagesRef = collection(db, 'chats', chatId, 'messages');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <Text style={styles.title}>{userName}</Text>
          <FontAwesome5 name="store-alt" size={24} color="#4caf50" />
        </View>
      ),
    });
  }, [navigation, userName]);

  useEffect(() => {
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to JS Date if needed
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", "Could not load messages");
    });
  
    return () => unsubscribe();
  }, [chatId]);
  
  const sendMessage = async () => {
    if (!inputText.trim()) return;
  
    try {
      // Add new message to subcollection
      await addDoc(messagesRef, {
        text: inputText,
        sender: 'seller',
        timestamp: serverTimestamp()
      });
  
      // Update chat document with last message info
      await updateDoc(chatRef, {
        lastMessage: inputText,
        lastMessageTime: serverTimestamp(),
        unread: true
      });
  
      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image source={image2} style={{ width: 30, height: 30 }} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{userName}</Text>
        <FontAwesome5 name="store-alt" size={30} color="#4caf50" />
      </View>

      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={item.sender === 'seller' ? styles.sellerMessageContainer : styles.userMessageContainer}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="gray"
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { padding: 15, backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: '#4caf50', fontSize: 30, fontWeight: 'bold' },
  userMessageContainer: { alignSelf: 'flex-start', backgroundColor: '#555', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  sellerMessageContainer: { alignSelf: 'flex-end', backgroundColor: '#4caf50', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  messageText: { color: 'white' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#222', alignItems: 'center' },
  input: { flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 5, marginRight: 10 },
  sendButton: { padding: 10, backgroundColor: '#4caf50', borderRadius: 5 },
});

export default SellerChatScreen;
