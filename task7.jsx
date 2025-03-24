import React from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";



const image = require('./assets/sign.png');
const image1 = require('./assets/gr.png');
const image3= require('./assets/sun.png')
const image19= require('./assets/msk1.png')
const image2 = require('./assets/arrow.png');
const image7 = require('./assets/next.png');
const image8 = require('./assets/nex.png');
const image9 = require('./assets/black.png');
const image10 = require('./assets/play.png');
const image11 = require('./assets/grb.png');

const TaskList = ({ navigation }) => {
  const DATA = 
    [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
        { id: "6" },
        { id: "7" },
        { id: "8" },
        { id: "9" },
        ]
  ;

  const renderItem2 = ({ item }) => {

    
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', marginVertical: 5,margin:5 }}>
      <Pressable style={{marginTop:10,borderRadius:10 , height:130, width: 120, backgroundColor: "#e7c574",alignItems:"center", }} onPress={() => navigation.navigate('Task7')}> 
        <Text style={{padding:2,fontWeight:"bold"}}>PKR 560.00</Text>
               <View style={{ flex:1,alignItems:'center',}}> 
                  <Image style={{width:120, height:80}} source={image3} resizeMode='stretch'/>
              </View>  
              <View>
                <Text style={{padding:2,fontWeight:"bold"}}>ITEM NAME</Text>
              </View>
        </Pressable> 
  </View>
  );
}

  return (
    <View style={{ flex: 1,padding:0, backgroundColor: 'black' }}>
      <Pressable style={{color:'white',position:'absolute',zIndex:1}} onPress={()=> navigation.goBack()}><Image style={{position:'absolute'}}source={image2}/></Pressable>
      <View style={{padding:15,paddingTop:20,flex:0.2,backgroundColor:"black"}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:"#e7c574",fontSize:40,fontFamily:"Pacifico"}}>Your Name</Text>
          <Icon name="gear" size={20} color="#e7c574" />
        </View>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:"#e7c574",fontSize:12,fontFamily:"Pacifico"}}>WISHLIST   </Text>
          <View style={{backgroundColor:"#636363",width:1}}></View>
          <Text style={{color:"#e7c574",fontSize:12,fontFamily:"Pacifico"}}>   FOLLOWING   </Text>
          <View style={{backgroundColor:"#636363",width:1}}></View>
          <Text style={{color:"#e7c574",fontSize:12,fontFamily:"Pacifico"}}>   REVIEWS</Text>
        </View>
      </View>
      <View style={{flex:0.4,backgroundColor:"black",}}>
        <View style={{backgroundColor:"#636363",height:1}}></View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:"#e7c574",fontSize:12,fontWeight:'bold',alignSelf:"flex-start"}}>MY ORDERS</Text>
          <Text style={{color:"#e7c574"}}>View All Orders <Icon name="arrow-right" size={20} color="#e7c574" /></Text>
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingTop:15,padding:10,paddingLeft:20}}>
          <View style={{}}>
            <Icon name="credit-card" size={45} color="white" />
            <Text style={{color:"white",fontSize:10,top:10}}>To Pay</Text>
          </View>
          <View>
            <Icon name="truck" size={45} color="white" />
            <Text style={{color:"white",fontSize:10,top:10}}>To Ship</Text>
          </View>
          <View>
            <Icon name="download" size={45} color="white" />
            <Text style={{color:"white",fontSize:10,top:10}}>To Recieve</Text>
          </View>
          <View>
            <Icon name="star" size={45} color="white" />
            <Text style={{color:"white",fontSize:10,top:10}}>To Review</Text>
          </View>
          <View>
            <Icon name="undo" size={45} color="white" />
            <Text style={{color:"white",fontSize:10,top:10,width:75}}>Returns & Cancellations</Text>
          </View>
        </View>
      </View>
      <View style={{flex:0.4,backgroundColor:"black"}}>
        <View style={{backgroundColor:"#636363",height:1}}></View>
        <View style={{padding:10}}>
        <Text style={{color:"#e7c574",fontSize:12,fontWeight:'bold',alignSelf:"flex-start"}}>HOW TO USE ZIDFAZID APP</Text>
        <View style={{padding:20,justifyContent:"space-between",height:115}}>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon name="heart" size={17} color="white" />
              <Text style={{color:"white",fontSize:12}}>   WISHLIST</Text>
            </View>
            <Icon  name="arrow-right" size={20} color="white" />
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon name="clock-o" size={17} color="white" />
              <Text style={{color:"white",fontSize:12}}>   THE ITEMS YOU VIEWED</Text>
            </View>
            <Icon  name="arrow-right" size={20} color="white" />
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon name="comments" size={17} color="white" />
              <Text style={{color:"white",fontSize:12}}>   YOUR COMMENTS</Text>
            </View>
            <Icon  name="arrow-right" size={20} color="white" />
          </View>
        </View>
        </View>
      </View>
      <View style={{flex:1,backgroundColor:"black",justifyContent:"space-between"}}>
        <View style={{backgroundColor:"#636363",height:1}}></View>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id} 
          renderItem={renderItem2}
          numColumns={3}
          showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
  );};
  export default TaskList;




//   <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
//   <View style={{ alignItems: 'center', marginTop: 30 }}>
//     <Image style={{ width: 150 }} source={image1} resizeMode='contain' />
//   </View>
// </View>
// <View style={{ flex: 0.45, paddingTop:20,paddingLeft:10 ,}}>
//   <Text style={{ color: '#4a4c58', fontWeight: 'bold', fontSize: 28 }}>
//     Good Morning, Afsar
//   </Text>
//   <Text style={{ color: '#a8abb8', fontSize: 17, paddingTop: 10 }}>
//     We Wish you have a good day
//   </Text>
// </View>
// <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
//   <View style={{ borderRadius: 10, margin: 5, height: 180, width: 180, backgroundColor: '#8e97fd', alignItems: 'center', justifyContent: 'center' }}>
//     <Image source={image8} style={{ height: "40%", resizeMode: 'contain' }} />
//     <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 19, right: 40, top: 20 }}>Basics</Text>
//     <Text style={{ color: 'white', fontSize: 19, right: 40, top: 20 }}>Course</Text>
//   </View>
//   <View style={{ borderRadius: 10, marginRight: 10, height: 180, width: 180, backgroundColor: '#ffc97e', alignItems: 'center', justifyContent: 'center' }}>
//     <Image source={image7} style={{ height: "120%", bottom: 10, resizeMode: 'contain' }} />
//     <Text style={{ fontWeight: 'bold', color: '#3f414e', bottom: 60, fontSize: 17, right: 30 }}>Relaxation</Text>
//     <Text style={{ color: '#3f414e', bottom: 60, fontSize: 17, right: 47 }}>Music</Text>
//   </View>
// </View>
// <View style={{ flex: 0.4,alignItems: 'center' }}>
//   <View style={{ bottom: 10, borderRadius: 10, backgroundColor: '#333242', width: 360, height: 90 }}>
//     <Image style={{  height: 90,width:360, right: 0, borderRadius: 30 }} source={image9} resizeMode='stretch'/>
//   </View>
//   <Image style={{ bottom: 75, left: 130 }} source={image10} />
//   <Text style={{ fontWeight: 'bold', color: 'white', bottom: 110, fontSize: 17, right: 100 }}>Daily Thought</Text>
//   <Text style={{ color: 'white', bottom: 110, fontSize: 13, right: 85 }}>MEDITATION - 3-10 MIN</Text>
// </View>
// <View style={{ flex: 0.2, padding: 10,marginTop:10,marginBottom:-20 }}>
//   <Text style={{ color: '#4a4c58', fontWeight: 'bold', fontSize: 25 }}>
//     Recommended for you
//   </Text>
// </View>
// <View style={{ flex: 1.5,paddingLeft:10,paddingBottom:0,paddingRight:10,marginBottom:-70,justifyContent:'flex-start'}}>
  

//   <FlatList
//     data={DATA}
//     keyExtractor={(item) => item.id} 
//     renderItem={renderItem2}
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//   />
// </View>