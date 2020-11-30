import React, { useState } from 'react';
import { Text, View, ScrollView, KeyboardAvoidingView,
         TextInput, Keyboard, SafeAreaView, Alert, StyleSheet,
         TouchableOpacity } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { openDatabase } from 'react-native-sqlite-storage';

let errorCB = (err) => {
    console.log("SQL ERROR: " + err)
};

let SuccessCB = () => {
    console.log("Opened UsersDatabase!")
};

let db = openDatabase({ name: 'Users.db'}, SuccessCB, errorCB);

const Signup = ({ navigation }) => {
    let [inputUserName, setInputUserName] = useState('');
    let [inputPassword, setInputPassword] = useState('');
    let [inputFirstName, setInputFirstName] = useState('');
    let [inputLastName, setInputLastName] = useState('');

    function generate_token(length){
        let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("")
        let b = [];
        for (let i = 0; i < length; i++){
            let j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }

    let register_info = () => {
        console.log(inputUserName, inputPassword, inputFirstName, inputLastName);

        if(!inputUserName){
            alert("Please fill in Username")
            return;
        }
        if(!inputPassword){
            alert("Please fill in Password")
            return;
        }
        if(!inputFirstName){
            alert("Please fill in First Name")
            return;
        }
        if(!inputLastName){
            alert("Please fill in Last Name")
            return;
        }
        let token = generate_token(64);
        db.transaction(function(tx) {
            let sqlStatement = `INSERT INTO users_table (user_name, user_password, 
                                first_name, last_name, user_token) VALUES (?, ?, ?, ?, ?)`
            
            tx.executeSql(
                sqlStatement,
                [inputUserName, inputPassword, inputFirstName, inputLastName, token],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'You are Registered Successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('Login'),
                                },
                            ],
                            {cancelable: false}
                        );
                    } else alert('Registration Failed');
                }
            );
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
            colors={['purple', 'darkblue']}
            style={styles.mainContent}
            >
                <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollViewStyle}>
                    <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.keyboardStyle}
                    >
                    <View>
                        <Text style={styles.titleStyle}>Enter Credentials</Text>
                        <View style={styles.inputTextBody}>
                            <View style={styles.inputTextContainer}>
                                <View style={styles.accidentalPressView}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Text style={styles.accidentalPressText}>Tap Here to go back!</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputTextView}>
                                    <Text style={styles.inputTextTitle}>Username:</Text>
                                    <TextInput
                                        style={styles.inputTextStyle}
                                        onChangeText={(inputUserName) => setInputUserName(inputUserName)}
                                        underlineColorAndroid="#FFFFFF"
                                        placeholder="Username Here!"
                                        placeholderTextColor="white"
                                        keyboardType="default"
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                        secureTextEntry={false}
                                    />
                                </View>

                                <View style={styles.inputTextView}>
                                    <Text style={styles.inputTextTitle}>Password:</Text>
                                    <TextInput
                                        style={styles.inputTextStyle}
                                        onChangeText={(inputPassword) => setInputPassword(inputPassword)}
                                        underlineColorAndroid="#FFFFFF"
                                        placeholder="Password Here!"
                                        placeholderTextColor="white"
                                        keyboardType="default"
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                        secureTextEntry={true}
                                    />
                                </View>

                                <View style={styles.inputTextView}>
                                    <Text style={styles.inputTextTitle}>First Name:</Text>
                                    <TextInput
                                        style={styles.inputTextStyle}
                                        onChangeText={(inputFirstName) => setInputFirstName(inputFirstName)}
                                        underlineColorAndroid="#FFFFFF"
                                        placeholder="First Name Here!"
                                        placeholderTextColor="white"
                                        keyboardType="default"
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                        secureTextEntry={false}
                                    />
                                </View>

                                <View style={styles.inputTextView}>
                                    <Text style={styles.inputTextTitle}>Last Name:</Text>
                                    <TextInput
                                        style={styles.inputTextStyle}
                                        onChangeText={(inputLastName) => setInputLastName(inputLastName)}
                                        underlineColorAndroid="#FFFFFF"
                                        placeholder="Last Name Here!"
                                        placeholderTextColor="white"
                                        keyboardType="default"
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                        secureTextEntry={false}
                                    />
                                </View>

                            </View>

                        </View>
                        <View style={styles.submitButton}>
                            <TouchableOpacity onPress={() => register_info()}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
};

export default Signup;

const styles = StyleSheet.create({

    container: {
        height: '100%',
        width: '100%',
    },

    mainContent: {
        height: '100%',
        width: '100%',
    },

    scrollViewStyle: {
        height: '0%',
        width: '100%',
    },

    keyboardStyle: {
        height: '100%',
        width: '100%',
    },

    titleStyle: {
        marginTop: 25,
        fontSize: 40,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        borderColor: 'gold',
        borderRadius: 30,
        borderWidth: 5,
        marginLeft: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        textAlign: 'center',
        color: 'white',
        padding: 20,
        width: 400,
        height: 100,
        alignSelf: 'center',
    },

    inputTextBody: {
        marginTop: 20,
        alignSelf: 'center',
        width: 350,
        height: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        justifyContent: 'center',
    },

    inputTextContainer: {
        marginTop: 30,
        width: 350,
        height: 500,
    },

    accidentalPressView: {
        height: 25,
        width: 150,
        alignSelf: 'flex-end',
        marginRight: 20,
        borderRadius: 5,
        borderColor: '#8109B7',
        borderWidth: 2,
    },

    accidentalPressText: {
        marginTop: 1,
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 25,
        width: 150,
    },

    inputTextView: {
        width: 300,
        height: 100,
        alignSelf: 'center',
    },

    inputTextTitle: {
        marginTop: 15,
        color: 'white',
        width: 300,
        height: 30,
        fontSize: 20,
        marginBottom: 7,
    },

    inputTextStyle: {
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'gold',
    },

    submitButton: {
        marginTop: 20,
        alignSelf: 'center',
        height: 50,
        width: 200,
        backgroundColor: '#A4ADE7',
        borderRadius: 20,
        marginBottom: 20,
    },

    submitButtonText: {
        marginTop: 13,
        width: 200,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: 'white'
    },

});