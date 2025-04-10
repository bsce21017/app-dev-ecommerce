import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { collection, doc, onSnapshot, orderBy, serverTimestamp, addDoc, updateDoc, query } from 'firebase/firestore';
import { db } from './../../firebaseConfig';

const ChatScreen = ({ navigation, route }) => {
  const { chatId, storeName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const chatRef = doc(db, 'chats', chatId);
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  useEffect(() => {
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(messagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
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
      await addDoc(messagesRef, {
        text: inputText,
        sender: 'user',
        timestamp: serverTimestamp()
      });

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
    <View 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.customHeader}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressedButton
          ]}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-left"
            size={20}
            color="#e7c574"
            style={styles.backIcon}
          />
        </Pressable>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{storeName}</Text>
          <FontAwesome5 name="store" size={20} color="#e7c574" style={styles.storeIcon} />
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender === 'user' ? styles.userMessage : styles.sellerMessage
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'user' && styles.userMessageText
            ]}>{item.text}</Text>
            <Text style={styles.timeText}>
              {item.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Pressable 
          onPress={sendMessage} 
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed
          ]}
          disabled={!inputText.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={inputText.trim() ? "#000" : "#555"} 
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    shadowColor: '#e7c574',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 40, // Offset for back button
  },
  title: {
    color: '#e7c574',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  storeIcon: {
    marginLeft: 5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 11,
    backgroundColor: 'rgba(231, 197, 116, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e7c574',
  },
  backIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pressedButton: {
    transform: [{ scale: 0.95 }],
    backgroundColor: 'rgba(231, 197, 116, 0.3)',
  },
  messagesList: {
    marginTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '70%',
    padding: 5,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e7c574',
    borderBottomRightRadius: 5,
  },
  sellerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    marginRight: 7,
    color: '#222',
    fontSize: 15,
  },
  userMessageText: {
    color: '#000',
  },
  timeText: {
    fontSize: 10,
    color: 'lightblack',
    alignSelf: 'flex-end',
    marginTop: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#e7c574',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonPressed: {
    backgroundColor: '#d4b367',
  },
});

export default ChatScreen;