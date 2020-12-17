import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Button, ScrollView, Alert, StyleSheet, Keyboard, TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';

let errorCB = (err) => {
    console.log("SQL ERROR: " + err);
};

let SuccessCB = () => {
    console.log("Opened Workout DB for Strength");
};

let db = openDatabase({ name: 'Workout.db'}, SuccessCB, errorCB);

const Strength = ({ navigation, route }) => {
    let [strengthGroup, setStrengthGroup] = useState('Machines');
    let [strengthMuscle, setStrengthMuscle] = useState('Calves');
    let [strengthDuration, setStrengthDuration] = useState('');
    let [strengthDurationType, setStrengthDurationType] = useState('Seconds');
    let [strengthResistance, setStrengthResistance] = useState('');
    let [strengthResistanceType, setStrengthResistanceType] = useState('Pounds(lbs)');
    let [strengthRepetition, setStrengthRepetition] = useState('');
    let [strengthRepetitionType, setStrengthRepetitionType] = useState('');
    let [strengthCalories, setStrengthCalories] = useState('');
    let [strengthHeartRate, setStrengthHeartRate] = useState('');
    let [strengthHeartRateType, setStrengthHeartRateType] = useState('Second');
    let [userToken, setUserToken] = useState('');

    const getAsyncData = async() => {
        try {
            AsyncStorage.getItem('userToken', function(errs, result) {
                if (!errs) {
                    if(result !== null) {
                        console.log('userToken' + result); // retireved successfully
                    }
                }
            }).then((userToken) => setUserToken(userToken));
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAsyncData();
    });

    let inputStrengthWorkout = () => {

        if(!strengthDuration){
            alert("Please fill Strength Duration");
            return;
        }
        if(!strengthResistance){
            alert("Please fill Strength Resistance");
            return;
        }
        if(!strengthRepetition){
            alert("Please fill Strength Repetition");
            return;
        }
        if(!strengthCalories){
            alert("Please fill Strength Calories");
            return;
        }
        if(!strengthHeartRate){
            alert("Please fill Strength Heart Rate");
            return;
        }

        function generate_token(length){
            let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("")
            let b = [];
            for (let i = 0; i < length; i++){
                let j = (Math.random() * (a.length-1)).toFixed(0);
                b[i] = a[j];
            }
            return b.join("");
        }
        let main_to_strength = generate_token(64);

        db.transaction(function (txn) {
            let createSQLStatement = `INSERT INTO workout_strength(
                workout_date, strength_muscle_group, strength_muscle, strength_duration,
                strength_duration_type, strength_resistance, strength_resistance_type,
                strength_repetition, strength_repetition_type, strength_calories_burned,
                strength_heart_rate, strength_heart_rate_type, user_token, main_to_strength)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            txn.executeSql(
                createSQLStatement,
                [route.params.date, strengthGroup, strengthMuscle,
                strengthDuration, strengthDurationType, strengthResistance,
                strengthResistanceType, strengthRepetition, strengthRepetitionType,
                strengthCalories, strengthHeartRate, strengthHeartRateType, userToken, main_to_strength],

                (txn, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        console.log('Strength inserted');
                    } else {
                        console.log('Strength did not insert');
                    }
                }
            );
        });

        db.transaction(function (txn) {
            let createSQLStatement = `INSERT INTO main_workout(
                workout_date, strength_id, user_token)
                VALUES (?, ?, ?)`;
            txn.executeSql(
                createSQLStatement,
                [route.params.date, main_to_strength, userToken],
            
            (txn, results) => {
                if (results.rowsAffected > 0) {
                    Alert.alert(
                        'Success',
                        'Strength submitted successfully',
                        [
                            {
                                text: 'Ok',
                                onPress: () => navigation.navigate("Let's Workout"),
                            },
                        ],
                        {cancelable: false}
                    );
                } else console.log('dates not inserted');
            }
            );
        });
    }

    return (
        <SafeAreaView>
            <View style={styles.mainArea}>
                <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollViewStyle}>
                    
                    <View style={styles.backButton}>
                        <Button title="Back" color="purple" onPress={() => navigation.goBack()} />
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Select Strength Group</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            selectedValue={strengthGroup}
                            style={styles.pickerStyles}
                            onValueChange={(itemValue, itemIndex) =>
                                setStrengthGroup(itemValue)
                            }>
                                <Picker.Item label="Machines" value="Machines" />
                                <Picker.Item label="Free Weights" value="Free Weights" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Select Strength Muscle</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            selectedValue={strengthMuscle}
                            style={styles.pickerStyles}
                            onValueChange={(itemValue, itemIndex) =>
                                setStrengthMuscle(itemValue)
                            }>
                                <Picker.Item label="Calves" value="Calves" />
                                <Picker.Item label="Hamstrings" value="Hamstrings" />
                                <Picker.Item label="Quadriceps" value="Quadriceps" />
                                <Picker.Item label="Gluteus Maximus" value="Gluteus Maximus" />
                                <Picker.Item label="Biceps" value="Biceps" />
                                <Picker.Item label="Triceps" value="Triceps" />
                                <Picker.Item label="Forearms" value="Forearms" />
                                <Picker.Item label="Trapezius" value="Trapezius" />
                                <Picker.Item label="Latissimus Dorsi" value="Latissimus Dorsi" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Duration</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Duration"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthDuration) =>
                                    setStrengthDuration(strengthDuration)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Duration Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            selectedValue={strengthDurationType}
                            style={styles.pickerStyles}
                            onValueChange={(itemValue,itemIndex) =>
                            setStrengthDurationType(itemValue)
                        }>
                            <Picker.Item label="Seconds" value="Seconds" />
                            <Picker.Item label="Minutes" value="Minutes" />
                            <Picker.Item label="Hours" value="Hours" />
                        </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Resistance</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Resistance"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthResistance) =>
                                    setStrengthResistance(strengthResistance)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Resistance Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            selectedValue={strengthResistanceType}
                            style={styles.pickerStyles}
                            onValueChange={(itemValue, itemIndex) =>
                                setStrengthResistanceType(itemValue)
                            }>
                                <Picker.Item label="Pounds(lbs)" value="Pounds(lbs)" />
                                <Picker.Item label="Kilograms(kg)" value="Kilograms(kg)" />
                                <Picker.Item label="Stone" value="Stone" />
                                <Picker.Item label="Gallons" value="Gallons" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Repetitions Reps</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Reps"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthRepetition) =>
                                    setStrengthRepetition(strengthRepetition)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Repetitions Sets</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Sets"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthRepetitionType) =>
                                    setStrengthRepetitionType(strengthRepetitionType)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Calories</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Calories"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthCalories) =>
                                    setStrengthCalories(strengthCalories)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Heart Rate</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle} 
                                placeholder="Heart Rate"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(strengthHeartRate) =>
                                    setStrengthHeartRate(strengthHeartRate)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Heart Rate Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            selectedValue={strengthHeartRateType}
                            style={styles.pickerStyles}
                            onValueChange={(itemValue, itemIndex) =>
                                setStrengthHeartRateType(itemValue)
                            }>
                                <Picker.Item label="Second" value="Second" />
                                <Picker.Item label="Minute" value="Minute" />
                                <Picker.Item label="Hour" value="Hour" />
                            </Picker>
                        </View>
                    </View>
                    
                    <View style={styles.backButton}>
                        <Button title="Submit" color="purple" onPress={inputStrengthWorkout} />
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

export default Strength

const styles = StyleSheet.create({
    mainArea: {
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'salmon',
    },

    backButton: {
        alignSelf: 'center',
        marginTop: 15,
        width: 200,
        height: 40,
        marginBottom: 15,
    },

    scrollViewStyle: {
        flexGrow: 1,
    },

    viewStyles: {
        alignSelf: 'center',
        marginTop: 15,
        width: 350,
        height: 110,
        borderRadius: 10,
        backgroundColor: 'white',
    },

    textTitles: {
        marginTop: 5,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'arial',
        color: 'black',
    },

    pickerView: {
        height: 50,
        width: 300,
        marginTop: 5,
        alignSelf: 'center',
        backgroundColor: 'pink',
        borderRadius: 10,
        marginBottom: 7,
    },

    pickerStyles: {
        height: 50,
        width: 300,
        alignSelf: 'center',
        borderRadius: 10,
        borderColor: 'gold',
        borderWidth: 1,
    },

    numberStyleView: {
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
    },

    numberStyle: {
        height: 50,
        width: 300,
        backgroundColor: 'pink',
        borderRadius: 10,
        alignSelf: 'center',
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
        paddingLeft: 7,
        marginBottom: 7,
    }

});