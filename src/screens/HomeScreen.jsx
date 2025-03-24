import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons
import CustomTextInput from './../components/CustomTextInput';
import PromoCard from "./../components/card";
import { ScrollView } from 'react-native-gesture-handler';

const FlashSale = ({ upperBar, BottomBar, showIcon, bottomBarText, bottomBarColor }) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flashSale}>
        {Array(4).fill(null).map((_, index) => (
          <TouchableOpacity key={index} style={styles.productCard}>
            <ImageBackground source={require("./../../assets/frame.png")} imageStyle={styles.image} style={styles.productImage}>
              {upperBar && <Text style={styles.price}>PKR 560.00</Text>}
              {BottomBar && <View style={styles.discountContainer}>
                <View style={[styles.discountBanner, { backgroundColor: bottomBarColor }]}>
                  {showIcon && <Icon name="whatshot" size={17} color="black" />}
                  <Text style={styles.discountText}>{bottomBarText}</Text>
                </View>
              </View>}
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./../../assets/logo.png')} style={styles.logo} />
        <CustomTextInput placeholder="Search" style={styles.input} onChangeText={(text) => console.log(text)} search={true} />
        <Icon name="notifications" size={30} color="#E7C574" />
      </View>
      <View style={styles.body}>
        <View style={styles.caurosel}>
          <Image style={styles.cauroselImage} source={require("./../../assets/banner.png")} />
        </View>
        <ScrollView horizontal>
          <View style={styles.cardContainer}>
            <PromoCard imagePath={require("./../../assets/bag.png")} smallText={"Looking \nFor a"} MiddleText={"Perfect"} LargeText={"Gift?"} />
            <PromoCard imagePath={require("./../../assets/sell-button.png")} smallText={"Looking \nFor a"} MiddleText={"Perfect"} LargeText={"Gift?"} />
            <PromoCard imagePath={require("./../../assets/calligraphy.png")} smallText={"Looking \nFor a"} MiddleText={"Perfect"} LargeText={"Gift?"} />
            <PromoCard smallText={"Finest Quality"} MiddleText={"Secure Payment"} LargeText={"24/7 Support"} simple={true} name1={"verified"} name2={"credit-score"} name3={"support-agent"} />
          </View>
        </ScrollView>
        <View>
          <Text style={styles.sectionTitle}>Flash Sale</Text>
          <FlashSale upperBar={true} BottomBar={true} bottomBarText={"50% OFF"} showIcon={true} bottomBarColor={'#F0C14B'} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlashSale upperBar={false} BottomBar={true} bottomBarText={"Tools"} showIcon={false} bottomBarColor={'white'} />
        </View>
      </View>
    </View>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B0E13",
    flex: 1,
  },

  header: {
    flexDirection: "row",
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 7,
    marginRight: 5,
  },

  logo: {
    width: 55,
    height: 50,
    marginRight: 3,
  },

  input: {
    width: 260,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 15,
  },

  body: {
    padding: 5,
  },

  caurosel: {
    alignItems: "center",
    marginBottom: 10
  },

  cauroselImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },

  cardContainer: {
    margin: 5,
    flexDirection: "row",
    columnGap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F0C14B',
    // marginBottom: 10
  },

  flashSale: {
    flexDirection: 'row'
  },

  productCard: {
    width: 100,
    height: 110,
    marginRight: 12,
    backgroundColor: '#111',  // FIX: Ensure background color is applied
    // borderWidth: 2, // FIX: Make sure a border is applied
    borderColor: '#333', // Adjust color as needed
  },

  productImage: {
    width: "100%",
    height: "87%",
    // alignItems: 'center',
    // justifyContent: 'center',
    position: "relative"
  },

  image: {
    width: "100%",
    borderRadius: 15,
    height: "100%"
  },

  price: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: "center",
    color: "black",
    backgroundColor: 'rgba(255, 223, 61, 0.6)', // Adds visibility on top of the image
    paddingHorizontal: 8,
    // paddingVertical: 4,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    // position: 'absolute',
    top: 0,
    left: 0
  },

  discountContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },

  discountBanner: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F0C14B',
    alignSelf: "center",
    justifyContent: "center",
    // paddingVertical: 6,
    // paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },

  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: "center",
    marginLeft: 5
  }

});