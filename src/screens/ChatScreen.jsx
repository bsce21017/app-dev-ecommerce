import React from 'react';
import { View, Text, SectionList, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import IconM from "react-native-vector-icons/MaterialIcons";

const ChatScreen = ({ navigation }) => {
  const chatData = [
    {
      title: 'Today',
      data: [
        { id: '1', userName: 'Thomas', message: 'Your order has been shipped', image: require('./../../assets/frame.png'), time: '10:30 AM', unread: true },
        { id: '2', userName: 'Alice', message: 'New collection available now', image: require('./../../assets/frame.png'), time: '09:15 AM', unread: false },
      ],
    },
    {
      title: 'Yesterday',
      data: [
        { id: '3', userName: 'Mughees', message: 'Your question about the product', image: require('./../../assets/frame.png'), time: '4:20 PM', unread: false },
        { id: '4', userName: 'Johnson', message: 'Special discount for you', image: require('./../../assets/frame.png'), time: '11:45 AM', unread: false },
      ],
    },
    {
      title: 'March 8, 2025',
      data: [
        { id: '5', userName: 'Abubakar', message: 'Thank you for your purchase', image: require('./../../assets/frame.png'), time: '2:15 PM', unread: false },
        { id: '6', userName: 'Trump', message: 'New arrivals coming soon', image: require('./../../assets/frame.png'), time: '10:00 AM', unread: false },
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
          <Text style={styles.userName}>{item.userName}</Text>
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
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <IconM name = {"arrow-back"} size = {23} color = {"white"}/>
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

export default ChatScreen;

// import React from 'react';
// import { View, Text, SectionList, FlatList, Image, Pressable, StyleSheet, ImageBackground } from 'react-native';
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";



// const image3 = require('./../../assets/sun.png')
// const image2 = require('./../../assets/arrow.png');
// const data = [
//   {
//     title: 'Today',
//     data: [
//       { id: '1', userName: 'Store 1', message: 'last message showing up there...', image: image3 },
//       { id: '2', userName: 'Store 2', message: 'last message showing up there...', image: image3 },
//     ],
//   },
//   {
//     title: 'Yesterday',
//     data: [
//       { id: '3', userName: 'Store 3', message: 'last message showing up there...', image: image3 },
//       { id: '4', userName: 'Store 4', message: 'last message showing up there...', image: image3 },
//     ],
//   },
//   {
//     title: '08/03/2025',
//     data: [
//       { id: '5', userName: 'Store 5', message: 'last message showing up there...', image: image3 },
//       { id: '6', userName: 'Store 6', message: 'last message showing up there...', image: image3 },
//     ],
//   },
// ];



// const ChatScreen = ({ navigation }) => {

//   const renderItem2 = ({ item }) => {


//     return (
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, margin: 5 }}>
//         <View style={{ height: 20, width: 20, margin: 5, borderWidth: 1, borderColor: "gray" }}></View>
//         <Pressable style={{ marginLeft: 10, marginTop: 5, borderRadius: 10, height: 130, width: 120, backgroundColor: "#e7c574", alignItems: "center", }} onPress={() => navigation.navigate('Task7')}>
//           <View style={{ flex: 1, alignItems: 'center', }}>
//             <Image style={{ width: 120, height: 130, borderRadius: 10 }} source={image3} resizeMode='stretch' />
//           </View>
//         </Pressable>
//         <View style={{ padding: 10, }}>
//           <Text style={{ width: 220, color: "white", fontSize: 13 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </Text>
//           <View style={{ flexDirection: "row" }}>
//             <Text style={{ color: "#e7c574", fontWeight: 'bold', fontSize: 20 }}>PKR 340</Text>

//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, padding: 0, backgroundColor: 'black' }}>
//       <Pressable style={{ color: 'white', position: 'absolute', zIndex: 1 }} onPress={() => navigation.goBack()}><Image style={{ position: 'absolute' }} source={image2} /></Pressable>
//       <View style={{ padding: 15, paddingTop: 20, flex: 0.1, backgroundColor: "black" }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//           <Text style={{ color: "#e7c574", fontSize: 40, fontFamily: "Pacifico" }}>MY CHATS</Text>
//           <Text style={{ color: "gray", alignSelf: "flex-end", fontSize: 10 }}>TOTAL CONSERVATIONS 87</Text>
//         </View>
//       </View>
//       <View style={{ flex: 1.5, backgroundColor: "black", justifyContent: "space-between" }}>
//         <View style={{ backgroundColor: "#636363", height: 1 }}></View>
//         <View style={styles.container}>
//           <SectionList
//             sections={data}
//             renderItem={({ item }) => (
//               <View style={styles.item}>
//                 <Image source={item.image} style={styles.image} />
//                 <View style={styles.textContainer}>
//                   <Text style={styles.userName}>{item.userName}</Text>
//                   <Text style={styles.message}>{item.message}</Text>
//                 </View>
//               </View>
//             )}
//             renderSectionHeader={({ section }) => (
//               <Text style={styles.sectionHeader}>{section.title}</Text>
//             )}
//             keyExtractor={(item) => item.id}
//           />
//         </View>
//       </View>
//       <View style={{ padding: 10, paddingRight: 20, backgroundColor: "#e7c574", height: 50, width: 400, alignItems: "center", justifyContent: 'flex-end', flexDirection: 'row' }}>
//         <Text style={{ fontWeight: "bold" }}>WHATS THE UPDATE     <Icon name="arrow-right" size={20} color="black" /></Text>
//       </View>
//     </View>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   sectionHeader: {
//     fontSize: 18,
//     color: '#e7c574',
//     backgroundColor: '#333',
//     padding: 10,
//     fontWeight: 'bold',
//   },
//   item: {
//     flexDirection: 'row',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   image: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//     borderRadius: 20,
//   },
//   textContainer: {
//     justifyContent: 'center',
//   },
//   userName: {
//     fontSize: 16,
//     color: '#e7c574',
//   },
//   message: {
//     fontSize: 14,
//     color: 'white',
//   },
// });

// export default ChatScreen;


