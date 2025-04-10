import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import IconM from "react-native-vector-icons/MaterialIcons";
import { collection, query, where, onSnapshot, getDoc, doc, and, or } from 'firebase/firestore';
import { auth, db } from './../../firebaseConfig';

const MyChatsScreen = ({ navigation }) => {
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('No user is signed in');
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'seller', user.uid));
        if (userDoc.exists()) {
          const businessName = userDoc.data().businessName;

          const chatsRef = collection(db, 'chats')

          const chatsQuery = query(
            chatsRef,
            // or(
              // where('storeName', '==', businessName),
              where('storeId', '==', user.uid)
            // )
          );

          const unsubscribeChats = onSnapshot(
            chatsQuery,
            (snapshot) => {
              try {
                const chats = [];
                snapshot.forEach((doc) => {
                  const data = doc.data();
                  chats.push({
                    id: doc.id,
                    userName: data.userName || 'Unnamed User',
                    message: data.lastMessage || '',
                    image: require('./../../assets/frame.png'),
                    time: data.lastMessageTime?.toDate() || new Date(),
                    unread: data.unread || false,
                  });
                });

                const groupedChats = groupChatsByDate(chats);
                setChatData(groupedChats);
                setError(null);
              } catch (err) {
                console.error('Error processing chats:', err);
                setError('Failed to load chats');
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.error('Chats snapshot error:', error);
              setError('Error loading chat data');
              setLoading(false);
            }
          );

          return unsubscribeChats;
        } else {
          setError('No seller document found');
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError('Failed to load store data');
        setLoading(false);
      }
    };

    const unsubscribeNav = navigation.addListener('focus', fetchData);
    const unsubscribePromise = fetchData();

    return () => {
      unsubscribeNav();
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [navigation]);


  const groupChatsByDate = (chats) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groups = chats.reduce((acc, chat) => {
      const chatDate = chat.time;
      let title;

      if (isSameDay(chatDate, today)) {
        title = 'Today';
      } else if (isSameDay(chatDate, yesterday)) {
        title = 'Yesterday';
      } else {
        title = chatDate.toLocaleDateString();
      }

      if (!acc[title]) acc[title] = [];
      acc[title].push(chat);
      return acc;
    }, {});

    return Object.keys(groups).map((title) => ({
      title,
      data: groups[title].sort((a, b) => b.time - a.time),
    }));
  };

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const renderChatItem = ({ item }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('TaskList', {
          chatId: item.id,
          userName: item.userName,
        })
      }
    >
      <Image source={item.image} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.chatTime}>
            {item.time ? item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
          </Text>
        </View>
        <Text
          style={[styles.chatMessage, item.unread && styles.unreadMessage]}
          numberOfLines={1}
        >
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <IconM name="arrow-back" size={23} color={"white"} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>MY CHATS</Text>
            <Text style={styles.chatCount}>
              {chatData.reduce((acc, curr) => acc + curr.data.length, 0)} CONVERSATIONS
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {chatData.length > 0 ? (
          <SectionList
            sections={chatData}
            renderItem={renderChatItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#E7C574',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#E7C574',
    fontSize: 16,
  },
});

export default MyChatsScreen;
