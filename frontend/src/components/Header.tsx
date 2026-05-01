import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function Header() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Good morning, Roshan</Text>
                <Text style={styles.subtitle}>Ready for today?</Text>
            </View>

            <View style={styles.bell}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#aaa',
        marginTop: 4,
    },
    bell: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4ADE80',
    },
});
