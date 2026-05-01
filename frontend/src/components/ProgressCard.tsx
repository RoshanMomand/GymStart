import React from 'react';
import {StyleSheet, Text, View} from 'react-native';


const ProgressCard: React.FC = () => (
    <View style={styles.card}>
        <Text style={styles.title}>Today's Progress</Text>

        {/*The calories that you burned on the day will be displayed here
        // TODO - Ask permission with a pop up to allow to track the burned calories
        */}
        <View style={styles.row}>
            <View style={styles.box}>
                <Text style={styles.number}>0</Text>
                <Text style={styles.label}>Calories</Text>
            </View>

            {/*The workouts that you completed on the day will be displayed here.*/}
            <View style={styles.box}>
                <Text style={styles.number}>1/6</Text>
                <Text style={styles.label}>Workouts</Text>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    title: {
        color: '#fff',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        backgroundColor: '#2A2A2A',
        flex: 1,
        marginRight: 8,
        padding: 16,
        borderRadius: 12,
    },
    number: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        color: '#aaa',
        marginTop: 4,
    },
});

export default ProgressCard;
