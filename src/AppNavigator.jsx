import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import CustomerSignUp from './screens/CustomerSignUp';
import CustomerSignIn from './screens/CustomerSignIn';
import SellerSignUp from './screens/SellerSignUp';
import BottomTabs from './BottomTabs';
import BottomNavbar from './SellerBottomNav'
import Product from './screens/Product';
import ProductList from './screens/ProductList';
import TaskList from "./screens/TaskList";
import TaskDetail from "./screens/TaskDetail";
import AddProduct from './screens/AddProduct';
import EditProduct from './screens/EditProduct';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmation from './screens/OrderConfirmation';
import OrdersScreen from "./screens/OrdersScreen"
import OrderDetailsScreen from './screens/OrderDetails';
import UserSettings from './screens/userSettings';
import OrdersReceivedScreen from './screens/OrdersReceivedScreen';


const App = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CustomerSignIn" component={CustomerSignIn} options={{ headerShown: false }} />
                <Stack.Screen name="CustomerSignUp" component={CustomerSignUp} options={{ headerShown: false }} />
                <Stack.Screen name="SellerSignUp" component={SellerSignUp} options={{ headerShown: false }} />
                <Stack.Screen name="UserHome" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="SellerHome" component={BottomNavbar} options={{ headerShown: false }} />
                <Stack.Screen name="OrdersReceived" component={OrdersReceivedScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Product" component={Product} options={{ headerShown: false }} />
                <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
                <Stack.Screen name="ProductList" component={ProductList} options={{ headerShown: false }} />
                <Stack.Screen name="TaskList" component={TaskList} options={{ headerShown: false }} />
                <Stack.Screen name="TaskDetail" component={TaskDetail} options={{ headerShown: false }} />
                <Stack.Screen name="EditProduct" component={EditProduct} options={{ headerShown: false }} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ headerShown: false }}/>
                <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="UserSettings" component={UserSettings} options={{ headerShown: false }}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;