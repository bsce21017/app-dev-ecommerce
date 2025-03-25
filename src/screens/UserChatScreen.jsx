import React from 'react';
import { View, Text, SectionList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

const ChatScreen = ({ navigation }) => {
  const chatData = [
    {
      title: 'Today',
      data: [
        { id: '1', storeName: 'Calligraphy Supplies', message: 'Your order has been shipped', image: require('./../../assets/sun.png'), time: '10:30 AM', unread: true },
        { id: '2', storeName: 'Art Gallery', message: 'New collection available now', image: require('./../../assets/sun.png'), time: '09:15 AM', unread: false },
      ],
    },
    {
      title: 'Yesterday',
      data: [
        { id: '3', storeName: 'English Master', message: 'Your question about the product', image: require('./../../assets/sun.png'), time: '4:20 PM', unread: false },
        { id: '4', storeName: 'Artist', message: 'Special discount for you', image: require('./../../assets/sun.png'), time: '11:45 AM', unread: false },
      ],
    },
    {
      title: 'March 8, 2025',
      data: [
        { id: '5', storeName: 'Home Decor', message: 'Thank you for your purchase', image: require('./../../assets/sun.png'), time: '2:15 PM', unread: false },
        { id: '6', storeName: 'Interior', message: 'New arrivals coming soon', image: require('./../../assets/sun.png'), time: '10:00 AM', unread: false },
      ],
    },
  ];

  const renderChatItem = ({ item }) => (
    <Pressable 
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatConversation', { chatId: item.id })}
    >
      <Image source={item.image} style={styles.chatImage} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.storeName}>{item.storeName}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text 
          style={[
            styles.chatMessage,
            item.unread && styles.unreadMessage
          ]}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image 
              source={require('./../../assets/arrow.png')}
              style={styles.backIcon}
            />
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

        <Pressable 
          style={styles.footerButton}
          onPress={() => navigation.navigate('NewChat')}
        >
          <Text style={styles.footerButtonText}>WHATS THE UPDATE</Text>
          <Icon name="arrow-right" size={16} color="black" />
        </Pressable>
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
  storeName: {
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 50, 
    width: 400,
    justifyContent: 'center',
  },
  footerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
    marginRight: 8,
  },
});

export default ChatScreen;

