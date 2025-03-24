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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5,margin:5 }}>
        <View style={{height:20,width:20,margin:5,borderWidth:1,borderColor:"gray"}}></View>
      <Pressable style={{marginLeft:10,marginTop:5,borderRadius:10 , height:130, width: 120, backgroundColor: "#e7c574",alignItems:"center", }} onPress={() => navigation.navigate('Task7')}> 
               <View style={{ flex:1,alignItems:'center',}}> 
                  <Image style={{width:120, height:130,borderRadius:10}} source={image3} resizeMode='stretch'/>
              </View>  
        </Pressable> 
        <View style={{padding:10,}}>
          <Text style={{width:220,color:"white",fontSize:13}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </Text>
          <View style={{flexDirection:"row"}}>
              <Text style={{color:"#e7c574",fontWeight:'bold',fontSize:20}}>PKR 340</Text>
              
          </View>
        </View>
  </View>
  );
}

  return (
    <View style={{ flex: 1,padding:0, backgroundColor: 'black' }}>
      <Pressable style={{color:'white',position:'absolute',zIndex:1}} onPress={()=> navigation.goBack()}><Image style={{position:'absolute'}}source={image2}/></Pressable>
      <View style={{padding:15,paddingTop:20,flex:0.1,backgroundColor:"black"}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{color:"#e7c574",fontSize:40,fontFamily:"Pacifico"}}>MY CART</Text>
          <Text style={{color:"gray",alignSelf:"flex-end",fontSize:10}}>TOTAL ITEMS 87</Text>
        </View>
      </View>
      <View style={{flex:1.5,backgroundColor:"black",justifyContent:"space-between"}}>
        <View style={{backgroundColor:"#636363",height:1}}></View>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id} 
          renderItem={renderItem2}
          showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={{padding:10,paddingRight:20,backgroundColor:"#e7c574",height:50,width:400,alignItems:"center",justifyContent:'space-between',flexDirection:'row'}}>
              <View style={{flexDirection:'row',justifyContent:"center",alignItems:"center"}}>
              <View style={{height:20,width:20,margin:5,borderWidth:1,borderColor:"gray"}}></View>
              <Text style={{fontWeight:'bold'}}> ALL</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{alignItems:"flex-end"}}>
                  <Text style={{fontWeight:'bol#e7c574d'}}>SUBTOTAL: PKR 3000</Text>
                  <Text style={{fontSize:10}}>Shipping Fee: PKR 300</Text>
                </View>
                <View style={{margin:7,borderRadius:3,height:20,width:100,backgroundColor:"black",alignItems:"center",}}>
                  <Text style={{fontWeight:'bold',color:"#e7c574"}}>CHECK OUT</Text>
                </View>
              </View>
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