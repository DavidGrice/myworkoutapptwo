import React from 'react';
import { Image, Text, View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import SplashImage from './Assets/Images/Splash_image.png'

const Splash = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <LinearGradient
                colors={['purple', 'darkblue']}
                style={styles.linerGradient}
                >
                    <Image
                        style={styles.splashLogo} 
                        source={SplashImage}
                    />
                    <Text style={styles.titleText}> MyWorkoutApp </Text>
                    <ActivityIndicator size="large" color="white" style={styles.loadingContent} />
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

export default Splash;

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignSelf: 'center',
    },

    container: {
        flex: 1,
        marginLeft: 0,
        marginTop: 0,
        flexDirection: 'column',
    },

    linerGradient: {
        alignContent: 'center',
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        paddingTop: 0,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
    },

    splashLogo: {
        marginTop: 0,
        width: '92%',
        height: '35%',
        resizeMode: 'stretch',
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },

    titleText: {
        fontSize: 50,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        borderColor: 'gold',
        borderRadius: 5,
        borderWidth: 5,
        marginLeft: 5,
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: 'white',
        width: '92%',
        alignSelf: 'center',
    },

    loadingContent: {
        marginTop: 35,
    },
});