import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

import Splash from './Splash';

import Login from './AuthStack/Login';
import Signup from './AuthStack/Signup';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
    return (
        <AuthStack.Navigator headerMode="none">
            <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Login'}}
            />
            <AuthStack.Screen
            name="Signup"
            component={Signup}
            options={{ title: 'Signup'}}
            />
        </AuthStack.Navigator>
    )
}

const RootStack = createStackNavigator();

const Main = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator headerMode="none">
                <RootStack.Screen
                name="AuthStack"
                component={AuthStackScreen}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default Main;