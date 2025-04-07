import React, { useState, useEffect  ,useLayoutEffect} from 'react';
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { collection, doc, onSnapshot, orderBy, serverTimestamp, addDoc, updateDoc, query } from 'firebase/firestore';
import { db } from './../../firebaseConfig';

const image2 = require('./../../assets/arrow.png');

const ChatScreen = ({ navigation , route}) => {
  const { chatId, storeName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <Text style={styles.title}>{storeName}</Text>
          <FontAwesome5 name="store" size={30} color="#e7c574" />
        </View>
      ),
    });
  }, [navigation, storeName]);

  useEffect(() => {
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(messagesQuery, 
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert timestamp
        }));
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        Alert.alert("Error", "Could not load messages");
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      // Add new message
      await addDoc(messagesRef, {
        text: inputText,
        sender: 'user', // Customer sends as 'user'
        timestamp: serverTimestamp()
      });

      // Update chat metadata
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
        <Text style={styles.title}>{storeName}</Text>
        <FontAwesome5 name="store" size={30} color="#e7c574" />
      </View>

      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={item.sender === 'user' ? styles.userMessageContainer : styles.sellerMessageContainer}>
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
  title: { color: '#e7c574', fontSize: 30, fontWeight: 'bold' },
  userMessageContainer: { alignSelf: 'flex-end', backgroundColor: '#555', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  sellerMessageContainer: { alignSelf: 'flex-start', backgroundColor: '#333', padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  messageText: { color: 'white' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#222', alignItems: 'center' },
  input: { flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 5, marginRight: 10 },
  sendButton: { padding: 10, backgroundColor: '#e7c574', borderRadius: 5 },
});

export default ChatScreen;
