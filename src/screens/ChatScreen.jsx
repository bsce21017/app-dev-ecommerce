import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import IconM from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";

const MyChatsScreen = ({ navigation }) => {
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    const currentStoreName = 'Metro'; 

    const unsubscribe = firestore()
      .collection('chats')
      .where('storeName', '==', currentStoreName)
      .onSnapshot(snapshot => {
        const chats = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          chats.push({
            id: doc.id,
            userName: data.userName || 'Unnamed User',
            message: data.lastMessage || '',
            image: require('./assets/frame.png'),
            time: data.lastMessageTime?.toDate() || new Date(),
            unread: data.unread || false,
          });
        });

        const groupedChats = groupChatsByDate(chats);
        setChatData(groupedChats);
      });

    return () => unsubscribe();
  }, []);

  const groupChatsByDate = (chats) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    chats.forEach(chat => {
      const chatDate = chat.time;
      let title;

      if (isSameDay(chatDate, today)) {
        title = 'Today';
      } else if (isSameDay(chatDate, yesterday)) {
        title = 'Yesterday';
      } else {
        title = chatDate.toLocaleDateString();
      }

      if (!groups[title]) groups[title] = [];
      groups[title].push(chat);
    });

    return Object.keys(groups).map(title => ({ title, data: groups[title] }));
  };

  const isSameDay = (d1, d2) => (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );

  const renderChatItem = ({ item }) => (
    <Pressable 
      style={styles.chatItem}
      onPress={() => navigation.navigate('TaskList', { chatId: item.id, userName: item.userName })}
    >
      <Image source={item.image} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.chatTime}>
  {item.time ? item.time.toLocaleTimeString() : '...'}
</Text>

        </View>
        <Text style={[styles.chatMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadBadge} />}
    </Pressable>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <IconM name="arrow-back" size={23} color={"white"} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>MY CHATS</Text>
            <Text style={styles.chatCount}>{chatData.reduce((acc, curr) => acc + curr.data.length, 0)} CONVERSATIONS</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <SectionList
          sections={chatData}
          renderItem={renderChatItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#E7C574',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    color: '#E7C574',
    fontSize: 24,
    fontFamily: 'Pacifico',
  },
  chatCount: {
    color: 'gray',
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#636363',
    marginHorizontal: 16,
  },
  listContent: {
    paddingBottom: 60,
  },
  sectionHeader: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    color: '#E7C574',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  chatImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E7C574',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    color: '#E7C574',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    color: '#777',
    fontSize: 12,
  },
  chatMessage: {
    color: '#AAA',
    fontSize: 14,
  },
  unreadMessage: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E7C574',
    marginLeft: 8,
  },
  footerButton: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: '#E7C574',
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50, 
    justifyContent: 'flex-end',
  },
  footerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
    marginRight: 8,
  },
});

export default MyChatsScreen;
