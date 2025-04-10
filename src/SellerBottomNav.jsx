import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SellerStore from './screens/SellerStore';
import ChatScreen from './screens/ChatScreen';
import Tools from './screens/Tools';
import SellerProfile from './screens/SellerProfile';

const Tab = createBottomTabNavigator();


const BottomNavbar = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: { backgroundColor: '#0B0E13', height: 60 },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'store';
                    else if (route.name === 'Tools') iconName = 'construction';
                    else if (route.name === 'Chats') iconName = 'message';
                    else if (route.name === 'Profile') iconName = 'person';
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#F0C14B',
                tabBarInactiveTintColor: '#888',
            })}
        >
            <Tab.Screen name="Home" component={SellerStore} options={{ headerShown: false }} />
            <Tab.Screen name="Tools" component={Tools} options={{ headerShown: false }} />
            <Tab.Screen name="Chats" component={ChatScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={SellerProfile} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};
export default BottomNavbar;

