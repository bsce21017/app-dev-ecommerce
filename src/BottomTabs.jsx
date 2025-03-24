import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: { backgroundColor: '#0B0E13', height: 60 },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Cart') iconName = 'shopping-cart';
                    else if (route.name === 'Profile') iconName = 'person';
                    else if (route.name === 'Wishlist') iconName = 'favorite';
                    else if (route.name === 'Chats') iconName = 'message';
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#F0C14B',
                tabBarInactiveTintColor: '#888',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Wishlist" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Cart" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Chats" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={HomeScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default BottomTabs;
