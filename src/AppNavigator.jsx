import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CustomerSignIn from './screens/CustomerSignIn';
import SellerSignUp from './screens/SellerSignUp';
import BottomTabs from './BottomTabs';

const App = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="CustomerSignIn" component={CustomerSignIn} options={{ headerShown: false }}/>
                <Stack.Screen name="SellerSignUp" component={SellerSignUp} options={{ headerShown: false }}/>
                <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;