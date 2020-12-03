import React from 'react';
import { Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Splash from './Splash';

import Login from './AuthStack/Login';
import Signup from './AuthStack/Signup';

import Home from './HomeStack/Home';
import Workout from './HomeStack/Workout';
import Stats from './HomeStack/Stats';
import Profile from './HomeStack/Profile';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => { 
    return (
        <AuthStack.Navigator headerMode="none">
            <AuthStack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login"}}
            />
            <AuthStack.Screen
            name="Signup"
            component={Signup}
            options={{ title: "Signup"}}
            />
        </AuthStack.Navigator>
    )
}

const HomeTabs = createMaterialBottomTabNavigator();
const HomeTabsScreen = () => {
    return(
        <HomeTabs.Navigator
        headerMode="none"
        initialRouteName="Home"
        shifting={true}>
            <HomeTabs.Screen name="Home" component={Home}
            options={{
                tabBarLabel: 'Home',
                tabBarColor: '#fdb964',
                tabBarIcon: ({focused}) => (
                    <Icon name={focused?"home":"home-outline"} style={{color:'white'}} size={24}/>
                ),
            }}/>
            <HomeTabs.Screen name="Workout" component={Workout}
            options={{
                tabBarLabel: 'Workout',
                tabBarColor: 'purple',
                tabBarIcon: ({focused}) => (
                    <Icon name={focused?'arm-flex':'arm-flex-outline'} style={{color:'white'}} size={24} />
                ),
            }} />
            <HomeTabs.Screen name="Stats" component={Stats}
            options={{
                tabBarLabel: 'Stats',
                tabBarColor: '#4A4DE7',
                tabBarIcon: ({focused}) => (
                    <Icon name={focused?'chart-areaspline':'chart-line'} style={{color:'white'}} size={24} />
                ),
            }} />
            <HomeTabs.Screen name="Profile" component={Profile}
            options={{
                tabBarLabel: 'Profile',
                tabBarColor: '#1a5028',
                tabBarIcon: ({focused}) => (
                    <Icon name={focused?'head':'head-outline'} style={{color:'white'}} size={24} />
                ),
            }} />
        </HomeTabs.Navigator>
    )
};


const RootStack = createStackNavigator();

const Main = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator headerMode="none">
                {/* <RootStack.Screen
                name="Authstack"
                component={AuthStackScreen}
                /> */}
                <RootStack.Screen
                name="HomeTabs"
                component={HomeTabsScreen}
                />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

export default Main;