import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/SellerStore';
import WelcomeScreen from './screens/WelcomeScreen';
import CustomerSignIn from './screens/CustomerSignIn';
import SellerSignUp from './screens/SellerSignUp';
import BottomTabs from './BottomTabs';
import BottomNavbar from './SellerBottomNav'

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
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;