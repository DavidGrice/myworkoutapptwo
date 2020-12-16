import React, { useEffect, useMemo, useReducer } from 'react';
import { Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';

// Splash Screen
import Splash from './Splash';

// Auth Stack
import Login from './AuthStack/Login';
import Signup from './AuthStack/Signup';

// Home Stack
import Home from './HomeStack/Home';
import Workout from './HomeStack/WorkoutStack/Workout';
import Stats from './HomeStack/Stats';
import Profile from './HomeStack/Profile';

// Workout Stack
import CreateWorkout from './HomeStack/WorkoutStack/CreateWorkout';
import Cardio from './HomeStack/WorkoutStack/Cardio';
import Strength from './HomeStack/WorkoutStack/Strength'
import WorkoutHistory from './HomeStack/WorkoutStack/WorkoutHistory';

import { AuthContext } from './Context';


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
            <HomeTabs.Screen name="Workout" component={WorkoutStackScreen}
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

const WorkoutStack = createStackNavigator();
const WorkoutStackScreen = () => {
    return (
        <WorkoutStack.Navigator
        headerMode="none">
            <WorkoutStack.Screen name="Let's Workout" component={Workout} />
            <WorkoutStack.Screen name="Create Workout" component={CreateWorkout} />
            <WorkoutStack.Screen name="Cardio" component={Cardio} />
            <WorkoutStack.Screen name="Strength" component={Strength} />
            <WorkoutStack.Screen name="Workout History" component={WorkoutHistory} />
        </WorkoutStack.Navigator>
    )
};


const RootStack = createStackNavigator();

const Main = () => {
    
    const initialAuthState = {
        isLoading: true,
        userName: null,
        userFirstName: null,
        userLastName: null,
        userToken: null,
    };

    const loginReducerState = (prevState, actionState) => {
        switch (actionState.type) {
        case 'RETRIEVE_TOKEN':
            return {
                userToken: actionState.user_token,
                isLoading: false,
            }
        case 'LOGIN':
            return {
                userName: actionState.user_name,
                userFirstName: actionState.first_name,
                userLastName: actionState.last_name,
                userToken: actionState.user_token,
                isLoading: false,
            }
        case 'LOGOUT':
            return {
                userName: null,
                userFirstName: null,
                userLastName: null,
                userToken: null,
                isLoading: false,
            }
        }
    };

    const [loginState, dispatchState] = useReducer(loginReducerState, initialAuthState);

    let authenticationContext = useMemo(() => {
        return {
            signIn: async(userName, userFirstName, userLastName, userToken) => {
                try {
                    await AsyncStorage.setItem('userToken', userToken);
                    await AsyncStorage.setItem('userFirstName', userFirstName);
                    await AsyncStorage.setItem('userLastName', userLastName);
                    await AsyncStorage.setItem('userName', userName);
                } catch(error) {
                    console.log(error)
                }
                dispatchState({type:'LOGIN', user_name: userName, first_name: userFirstName, last_name:userLastName, user_token: userToken})
            },
            signOut: async() => {
                try {
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('userFirstName');
                    await AsyncStorage.removeItem('userLastName');
                    await AsyncStorage.removeItem('userName');
                } catch(error) {
                    console.log(error)
                }
                dispatchState({type:'LOGOUT'})
            },
        }
    }, [])

    useEffect(() => {
        setTimeout(async() => {
            let userToken = null;

            try {
                userToken = await AsyncStorage.getItem('userToken');
            } catch(error) {
                console.log(error)
            }
            dispatchState({type: 'RETRIEVE_TOKEN', user_token: userToken})
        }, 3000);

    }, []);



    if (loginState.isLoading){
        return <Splash />
    }

    return (
        <AuthContext.Provider value={authenticationContext}>
            <NavigationContainer>
                {loginState.userToken ? (
                    <RootStack.Navigator headerMode="none">
                        <RootStack.Screen
                        name="HomeTabs"
                        component={HomeTabsScreen}
                        />
                    </RootStack.Navigator>
                ) : (
                    <RootStack.Navigator headerMode="none">
                        <RootStack.Screen
                        name="AuthStack"
                        component={AuthStackScreen}
                        />
                    </RootStack.Navigator>
                )}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

export default Main;