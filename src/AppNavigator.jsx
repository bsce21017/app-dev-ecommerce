import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/SellerStore';
import WelcomeScreen from './screens/WelcomeScreen';
import CustomerSignIn from './screens/CustomerSignIn';
import SellerSignUp from './screens/SellerSignUp';
import BottomTabs from './BottomTabs';
import BottomNavbar from './SellerBottomNav'
import Product from './screens/Product';
import ProductList from './screens/ProductList';
import AddProduct from './screens/AddProduct';

const App = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="CustomerSignIn" component={CustomerSignIn} options={{ headerShown: false }}/>
                <Stack.Screen name="SellerSignUp" component={SellerSignUp} options={{ headerShown: false }}/>
                <Stack.Screen name="UserHome" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="SellerHome" component={BottomNavbar} options={{ headerShown: false }} />
                <Stack.Screen name="Product" component={Product} options={{ headerShown: false }} />
                <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
                <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;