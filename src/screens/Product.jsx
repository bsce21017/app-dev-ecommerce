import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, flex, StyleSheet, ImageBackground } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

const image3 = require('./../../assets/sun.png')
const image7 = require('./assets/logo.png')

const Product = ({ navigation }) => {




  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [quantityDropdown, setQuantityDropdown] = useState(false);
  const [colorDropdown, setColorDropdown] = useState(false);
  const [styleDropdown, setStyleDropdown] = useState(false);


  const data = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ];

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const renderItem = ({ item }) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.dropdownText}>{item.name}</Text>
    </View>
  );

  const RatingStars = ({ rating = 4 }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View style={{ flexDirection: 'row' }}>
        {Array(fullStars).fill().map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={18} color="#FFD700" />
        ))}
        {hasHalfStar && (
          <Icon name="star-half-full" size={18} color="#FFD700" />
        )}
        {Array(emptyStars).fill().map((_, i) => (
          <Icon key={`empty-${i}`} name="star-o" size={18} color="#FFD700" />
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ backgroundColor: "black", height: 0, flex: 0.35, flexDirection: "row", padding: 5, paddingBottom: 5, justifyContent: 'space-between', alignSelf: 'auto' }}>
        <Image style={{ height: 35, width: 40, alignSelf: 'center' }} resizeMode='stretch' source={image7}></Image>
        <Pressable style={{ borderRadius: 30, backgroundColor: '#e7c574', margin: 12, alignItems: 'center', top: 0, height: 30, width: 280 }} onPress={() => navigation.navigate('TaskList')}>
          <Text style={{ color: 'black', fontSize: 15, top: 4, left: 10, alignSelf: "flex-start" }}><Icon name="search" size={20} color="black" />  Search For Anything</Text>
        </Pressable>
        <Icon name="bell" size={22} color="#ff9800" style={{ paddingTop: 0, alignSelf: "center", marginTop: 5 }} />
      </View>
      <View style={{ flex: 2, backgroundColor: "black" }}>
        <ImageBackground source={image3} style={{ padding: 0, height: 340, marginTop: 0 }} resizeMode='stretch'>
        </ImageBackground>
      </View>
      <View style={{ flex: 0.7, padding: 7, paddingTop: 20, paddingBottom: 20, backgroundColor: "black" }}>
        <Text style={{ color: "#e7c574", fontWeight: 'bold', fontSize: 14 }}>PRODUCT NAME</Text>
        <Text style={{ color: "white", fontSize: 13 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </Text>
        <Text style={{ color: "#e7c574", fontWeight: 'bold', fontSize: 20 }}>PKR 340</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: "white", fontSize: 12.5, textDecorationLine: 'line-through', }}>PKR 600</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 5, paddingBottom: 4, borderRadius: 5, borderColor: "#e7c574", borderWidth: 0.5, width: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={18} color="#e7c574" style={{ paddingTop: 0, alignSelf: "center", marginTop: 5 }} />
            </View>
            <View style={{ marginRight: 5, paddingBottom: 4, borderRadius: 5, borderColor: "#e7c574", borderWidth: 0.5, width: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shopping-cart" size={18} color="#e7c574" style={{ paddingTop: 0, alignSelf: "center", marginTop: 5 }} />
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 0.3, backgroundColor: "black", justifyContent: 'space-between' }}>
        <View style={{ backgroundColor: "#636363", height: 1 }}></View>
        <View style={{ flexDirection: 'row', padding: 7 }}>
          <View>
            <Pressable
              style={styles.selector}
              onPress={() => setQuantityDropdown(!quantityDropdown)}
            >
              <Text style={styles.selectorLabel}>Quantity</Text>
              <Icon
                name={quantityDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#e7c574"
              />
            </Pressable>
            {quantityDropdown && (
              <View style={[styles.dropdownContainer, { top: 35, left: 0 }]}>
                <View style={styles.dropdown}>
                  <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
                </View>
              </View>
            )}
          </View>
          <View>
            <Pressable
              style={styles.selector}
              onPress={() => setColorDropdown(!colorDropdown)}
            >
              <Text style={styles.selectorLabel}>Color</Text>
              <Icon
                name={colorDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#e7c574"
              />
            </Pressable>
            {colorDropdown && (
              <View style={[styles.dropdownContainer, { top: 35, left: 0 }]}>
                <View style={styles.dropdown}>
                  <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
                </View>
              </View>
            )}
          </View>
          <View>
            <Pressable
              style={styles.selector}
              onPress={() => setStyleDropdown(!styleDropdown)}
            >
              <Text style={styles.selectorLabel}>Style</Text>
              <Icon
                name={styleDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#e7c574"
              />
            </Pressable>
            {styleDropdown && (
              <View style={[styles.dropdownContainer, { top: 35, left: 0 }]}>
                <View style={styles.dropdown}>
                  <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
                </View>
              </View>
            )}
          </View>
          <View>
            <Pressable
              style={styles.selector}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={styles.selectorLabel}>Size</Text>
              <Icon
                name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#e7c574"
              />

            </Pressable>
            {dropdownVisible && (
              <View style={[styles.dropdownContainer, { top: 35, left: 0 }]}>
                <View style={styles.dropdown}>
                  <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{ backgroundColor: "#636363", height: 1 }}></View>
      </View>
      <View style={{ flex: 0.5, padding: 7, backgroundColor: "black" }}>
        <Text style={{ color: "#e7c574", fontWeight: 'bold', fontSize: 15 }}>PRODUCT DETAILS</Text>
        <Text style={{ color: "white", fontSize: 13 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris </Text>

      </View>
      <View style={{ flex: 0.3, paddingTop: 0, paddingLeft: 0, backgroundColor: "black", justifyContent: 'space-between' }}>
        <View style={{ backgroundColor: "#636363", height: 1 }}></View>
        <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 7 }} onPress={() => navigation.navigate('Task8')}>
          <Text style={{ color: "#e7c574", fontWeight: 'bold', fontSize: 15 }}>PRODUCT DETAILS</Text>
          <RatingStars rating={3.5} />
        </Pressable>
        <View style={{ backgroundColor: "#636363", height: 1 }}></View>
      </View>
      <View style={{ flex: 0.35, backgroundColor: "white", flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: "#e7c574" }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#e7c574" }}>
          <Text>ORDER NOW <Icon name="shopping-basket" size={20} color="black" /></Text>
        </View>
        <View style={{ backgroundColor: "black", width: 2, right: 10 }}></View>
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#e7c574" }}>
          <Text>CHAT <Icon name="comments" size={20} color="black" /></Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  selector: {
    marginRight: 7,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: "#e7c574",
    borderRadius: 5,
    width: 80,
    paddingLeft: 5,
    paddingBottom: 2,
    paddingRight: 5,
  },
  selectorLabel: {
    color: "#e7c574"
  },
  selectorValue: {
    color: "white"
  },
  dropdownContainer: {
    position: 'absolute',
    top: 35,
    zIndex: 1000,
    width: 120
  },

  dropdown: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e7c574',
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e7c574',
  },
  dropdownText: {
    color: '#e7c574',
    fontSize: 16,
  },
});

export default Product;


