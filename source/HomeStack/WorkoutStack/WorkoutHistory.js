import React, { useEffect, useState } from 'react';
import { Text, Button, View, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';

let errorCB = (err) => {
    console.log("SQL Error: " + err);
};

let SuccessCB = () => {
    console.log("Workout History DB opened!");
};

let db = openDatabase({ name: 'Workout.db' }, SuccessCB, errorCB);

const WorkoutHistory = ({ navigation }) => {
    let [flatListItems, setFlatListItems] = useState([]);

    useEffect(() => {
        // Async Function Call
        getAsyncData();
    }, []);

    const getAsyncData = async() => {
        try {
            AsyncStorage.getItem('userToken', function(errs, result) {
                if (!errs) {
                    console.log('userToken' + result);
                    db.transaction((tx) => {
                        let sqlStatement = `SELECT DISTINCT main_workout.workout_date, main_workout.user_token FROM main_workout
                        LEFT JOIN workout_cardio ON workout_cardio.workout_date = main_workout.workout_date
                                                    AND workout_cardio.user_token = main_workout.user_token
                        LEFT JOIN workout_strength ON workout_strength.workout_date = main_workout.workout_date
                                                    AND workout_strength.user_token = main_workout.user_token
                        WHERE main_workout.user_token = ?`
                        
                    tx.executeSql(sqlStatement, [result], (tx, results) => {
                        let temp = [];
                        for (let i = 0; i < results.rows.length; ++i)
                            temp.push(results.rows.item(i));
                        console.log(temp)
                        setFlatListItems(temp);
                    });
                });
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    let listViewItemSeparator = () => {
        return (
            <View
            />
        );
    };

    let listItemView = (item) => {
        let textDate = item.workout_date.toString();
        return (
            <View
            key={item.user_token}
            style={styles.buttonDates}
            >
                <Button title={textDate} color="salmon" onPress={() => navigation.navigate("WorkoutHistorySummary", {date: item.workout_date})}/>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.backButton}>
                <Button title="Back" color="purple" onPress={() => navigation.goBack()} />
            </View>
            <View style={styles.secondaryContainer}>
                <View style={styles.secondaryContainer}>
                    <FlatList
                    data={flatListItems}
                    ItemSeparatorComponent={listViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => listItemView(item)}
                />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default WorkoutHistory;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'pink',
    },

    secondaryContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignSelf: 'center',
        width: 375,
        marginBottom: 10,
        borderRadius: 10,
    },

    backButton: {
        alignSelf: 'center',
        marginTop: 15,
        width: 200,
        height: 40,
        marginBottom: 10,
    },

    buttonDates: {
        alignSelf: 'center',
        marginTop: 15,
        width: 300,
        height: 40,
        marginBottom: 10,
    },

})