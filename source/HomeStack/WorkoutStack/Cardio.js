import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, Button, ScrollView, Alert, StyleSheet, Keyboard, TextInput } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from '@react-native-community/picker';

let errorCB = (err) => {
    console.log("SQL ERROR: " + err);
};

let SuccessCB = () => {
    console.log("Opened Workout DB for Cardio");
};

let db = openDatabase({ name: 'Workout.db'}, SuccessCB, errorCB);

const Cardio = ({ navigation, route}) => {
    // Create variables for the data storage
    let [cardioGroup, setCardioGroup] = useState('Low intensity, long duration');
    let [cardioMuscle, setCardioMuscle] = useState('Upper Back');
    let [cardioDuration, setCardioDuration] = useState('');
    let [cardioDurationType, setCardioDurationType] = useState('Seconds');
    let [cardioResistance, setCardioResistance] = useState('');
    let [cardioResistanceType, setCardioResistanceType] = useState('Pounds(lbs)');
    let [cardioDistance, setCardioDistance] = useState('');
    let [cardioDistanceType, setCardioDistanceType] = useState('Feet(ft)');
    let [cardioCalories, setCardioCalories] = useState('');
    let [cardioHeartRate, setCardioHeartRate] = useState('');
    let [cardioHeartRateType, setCardioHeartRateType] = useState('Second');
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

    let inputCardioWorkout = () => {

        if(!cardioDuration){
            alert("Please fill Cardio Duration");
            return;
        }
        if(!cardioResistance){
            alert("Please fill Cardio Resistance");
            return;
        }
        if(!cardioDistance){
            alert("Please fill Cardio Distance");
            return;
        }
        if(!cardioCalories){
            alert("Please fill Cardio Calories");
            return;
        }
        if(!cardioHeartRate){
            alert("Please fill Cardio Heart Rate");
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
        let main_to_cardio = generate_token(64);

        db.transaction(function (txn) {
            let createSQLStatement = `INSERT INTO workout_cardio(
                workout_date, cardio_muscle_group, cardio_muscle, cardio_duration,
                cardio_duration_type, cardio_resistance, cardio_resistance_type,
                cardio_distance, cardio_distance_type, cardio_calories_burned,
                cardio_heart_rate, cardio_heart_rate_type, user_token, main_to_cardio)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            txn.executeSql(
                createSQLStatement,
                [route.params.date, cardioGroup, cardioMuscle,
                cardioDuration, cardioDurationType, cardioResistance,
                cardioResistanceType, cardioDistance, cardioDistanceType,
                cardioCalories, cardioHeartRate, cardioHeartRateType, userToken, main_to_cardio],

                (txn, results) => {
                    if(results.rowsAffected > 0) {
                        console.log("Cardio inserted!")
                    } else console.log('Cardio not inserted');
                }
            );
        });

        db.transaction(function (txn) {
            let createSQLStatement = `INSERT INTO main_workout(
                workout_date, cardio_id, user_token)
                VALUES (?, ?, ?)`
            txn.executeSql(
                createSQLStatement,
                [route.params.date, main_to_cardio, userToken],

            (txn, results) => {
                if(results.rowsAffected > 0) {
                    Alert.alert(
                        'Success',
                        'Cardio submitted successfully',
                        [
                            {
                                text: 'Ok',
                                onPress: () => navigation.navigate("Let's Workout"),
                            },
                        ],
                        { cancelable: false}
                    );
                } else console.log('Cardio info not inserted');
            }
            );
        });


    };

    return (
        <SafeAreaView>
            <View style={styles.mainArea}>
                <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollViewStyle}>
                    <View style={styles.backButton}>
                        <Button title="Back" color="purple" onPress={() => navigation.goBack()} />
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Select Cardio Group</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioGroup}
                            onValueChange={(itemValue, itemIndex) => 
                                setCardioGroup(itemValue)
                            }>
                                <Picker.Item label="Low intensity, long duration" value="Low intensity, long duration" />
                                <Picker.Item label="Medium intensity, medium duration" value="Medium intensity, medium duration" />
                                <Picker.Item label="High intensity, short duration" value="High intensity, short duration" />
                                <Picker.Item label="Aerobic Interval Training" value="Aerobic Interval Training" />
                                <Picker.Item label="Anaerobic Interval Training" value="Anaerobic Interval Training" />
                                <Picker.Item label="Fartlek Training, or speed play" value="Fartlek Training, or speed play" />
                                <Picker.Item label="Circuit Training" value="Circuit Training" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Select Cardio Muscle</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioMuscle}
                            onValueChange={(itemValue, itemIndex) => 
                            setCardioMuscle(itemValue)
                            }>
                                <Picker.Item label="Upper Back" value="Upper Back" />
                                <Picker.Item label="Infraspinatus" value="Infraspinatus" />
                                <Picker.Item label="Triceps" value="Triceps" />
                                <Picker.Item label="Middle Back" value="Middle Back" />
                                <Picker.Item label="Lower Back" value="Lower Back" />
                                <Picker.Item label="Gluteus Maximus" value="Gluteus Maximus" />
                                <Picker.Item label="Hamstring Group" value="Hamstring Group" />
                                <Picker.Item label="Calf" value="Calf" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Duration</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput
                                style={styles.numberStyle}
                                underlineColorAndroid="transparent"
                                placeholder="Duration"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(cardioDuration) => setCardioDuration(cardioDuration)}
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Duration Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioDurationType}
                            onValueChange={(itemValue, itemIndex) => 
                                setCardioDurationType(itemValue)
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
                                underlineColorAndroid="transparent"
                                placeholder="Resistance"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(cardioResistance) => setCardioResistance(cardioResistance)}
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Resistance Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioResistanceType}
                            onValueChange={(itemValue, itemIndex) =>
                                setCardioResistanceType(itemValue)
                            }>
                                <Picker.Item label="Pounds(lbs)" value="Pounds(lbs)" />
                                <Picker.Item label="Kilograms(kg)" value="Kilograms(kg)" />
                                <Picker.Item label="Stone" value="Stone" />
                                <Picker.Item label="Gallons" value="Gallons" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Distance</Text>
                        <View style={styles.numberStyleView}>
                            <TextInput 
                                style={styles.numberStyle}
                                placeholder="Distance"
                                keyboardType="numeric"
                                placeholderTextColor="black"
                                onSubmitEditing={Keyboard.dismiss}
                                onChangeText={(cardioDistance) => setCardioDistance(cardioDistance)}
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Distance Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioDistanceType}
                            onValueChange={(itemValue, itemIndex) =>
                                setCardioDistanceType(itemValue)
                            }>
                                <Picker.Item label="Feet(ft)" value="Feet(ft)" />
                                <Picker.Item label="Miles(Mil)" value="Miles(Mil)" />
                                <Picker.Item label="Metres(m)" value="Metres(m)" />
                                <Picker.Item label="Kilometres(km)" value="Kilometres(km)" />
                            </Picker>
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
                                onChangeText={(cardioCalories) =>
                                    setCardioCalories(cardioCalories)
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
                                onChangeText={(cardioHeartRate) =>
                                    setCardioHeartRate(cardioHeartRate)
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.viewStyles}>
                        <Text style={styles.textTitles}>Heart Rate Type</Text>
                        <View style={styles.pickerView}>
                            <Picker
                            style={styles.pickerStyles}
                            selectedValue={cardioHeartRateType}
                            onValueChange={(itemValue, itemIndex) =>
                                setCardioHeartRateType(itemValue)
                            }>
                                <Picker.Item label="Second" value="Second" />
                                <Picker.Item label="Minute" value="Minute" />
                                <Picker.Item label="Hour" value="Hour" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.backButton}>
                        <Button title="Submit" color="purple" onPress={inputCardioWorkout} />
                    </View>


                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

export default Cardio;

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