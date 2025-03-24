import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from './../components/CustomTextInput';
import PromoCard from "./../components/card";

const Cards = ({ data = [], upperBar, BottomBar, showIcon, bottomBarColor, upperBarColor, gridMode }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[
      styles.productCard,
      gridMode && styles.gridProductCard 
    ]}>
      <ImageBackground
        source={item.image || require("./../../assets/frame.png")}
        imageStyle={styles.image}
        style={[
          styles.productImage,
          gridMode && styles.gridProductImage 
        ]}
      >
        {upperBar && (
          <Text style={[
            styles.price,
            { backgroundColor: upperBarColor },
            gridMode && styles.gridPrice 
          ]}>
            {item.upperBarText}
          </Text>
        )}
        {BottomBar && (
          <View style={styles.discountContainer}>
            <View style={[
              styles.discountBanner,
              { backgroundColor: bottomBarColor },
              gridMode && styles.gridDiscountBanner
            ]}>
              {showIcon && <Icon name="whatshot" size={gridMode ? 14 : 17} color="black" />}
              <Text style={[
                styles.discountText,
                gridMode && styles.gridDiscountText 
              ]}>
                {item.bottomBarText}
              </Text>
            </View>
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );


  if (gridMode) {
    const rows = Math.ceil(data.length / 4);
    return (
      <View>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <FlatList
            key={rowIndex.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data.slice(rowIndex * 4, (rowIndex + 1) * 4)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.cardList}
          />
        ))}
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.cardList}
    />

  );
}

const HomeScreen = () => {
  const flashSaleData = [
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 560.00', bottomBarText: '50% OFF' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 750.00', bottomBarText: '30% OFF' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 750.00', bottomBarText: '30% OFF' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 750.00', bottomBarText: '30% OFF' },
  ];

  const categoriesData = [
    { image: require('./../../assets/frame.png'), bottomBarText: 'Tools' },
    { image: require('./../../assets/frame.png'), bottomBarText: 'Calligraphy' },
    { image: require('./../../assets/frame.png'), bottomBarText: 'Painting' },
    { image: require('./../../assets/frame.png'), bottomBarText: 'Thuluth' },
  ];

  const moreToLoveData = [
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 1200.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
    { image: require('./../../assets/frame.png'), upperBarText: 'Rs 899.00' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./../../assets/logo.png')} style={styles.logo} />
        <CustomTextInput placeholder="Search" style={styles.input} onChangeText={(text) => console.log(text)} search={true} />
        <Icon name="notifications" size={30} color="#E7C574" />
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.caurosel}>
          <Image style={styles.cauroselImage} source={require("./../../assets/banner.png")} />
        </View>
        <View style={styles.cardContainer}>
          <PromoCard imagePath={require("./../../assets/bag.png")} smallText={"Looking \nFor a"} MiddleText={"Perfect"} LargeText={"Gift?"} />
          <PromoCard imagePath={require("./../../assets/sell-button.png")} smallText={"Want to"} MiddleText={"Sell"} MiddleNormal = {"Your"} LargeText={"Artworks"} />
          <PromoCard imagePath={require("./../../assets/calligraphy.png")} smallText={"Want Your"} MiddleText={"Wall"} MiddleNormal = {"Decor With"} LargeText={"Artworks"} />
          <PromoCard smallText={"Finest Quality"} MiddleText={"Secure Payment"} LargeText={"24/7 Support"} simple={true} name1={"verified"} name2={"credit-score"} name3={"support-agent"} />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Flash Sale</Text>
          <Cards
            data={flashSaleData}
            upperBar={true}
            BottomBar={true}
            showIcon={true}
            bottomBarColor={'#F0C14B'}
            upperBarColor={'rgba(255, 223, 61, 0.6)'}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Cards
            data={categoriesData}
            upperBar={false}
            BottomBar={true}
            showIcon={false}
            bottomBarColor={'white'}
          />
        </View>

        <View>
          <Text style={styles.sectionTitle}>More To Love</Text>
          <Cards
            data={moreToLoveData}
            upperBar={true}
            BottomBar={false}
            showIcon={false}
            upperBarColor={'white'}
            gridMode={moreToLoveData.length > 4}
          />
        </View>
      </ScrollView>
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

  cardList: {
    flexDirection: 'row'
  },

  productCard: {
    width: 90,
    height: 100,
    marginRight: 5,
    // marginBottom: 10,
  },

  gridProductCard: {
    width: 80,  
    height: 90, 
    marginRight: 8,
    marginBottom: 4,
  },

  productImage: {
    width: "100%",
    height: "87%",
    // alignItems: 'center',
    // justifyContent: 'center',
    position: "relative"
  },

    gridProductImage: {
      height: "85%", 
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
    backgroundColor: 'rgba(255, 223, 61, 0.6)',
    paddingHorizontal: 8,
    // paddingVertical: 4,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    // position: 'absolute',
    top: 0,
    left: 0
  },

  gridPrice: {
    fontSize: 9, 
    paddingHorizontal: 6, 
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

  gridDiscountBanner: {
    width: 70, 
    paddingVertical: 3,
  },

  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: "center",
    marginLeft: 5
  },

  gridDiscountText: {
    fontSize: 9, 
    marginLeft: 3,
  },
});