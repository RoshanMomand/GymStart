import React from 'react';
import {StyleSheet, View} from 'react-native';

type Props = {
    progress: number; // 0 → 1
};

export default function ProgressBar({progress}: Props) {
    return (
        <View style={styles.container}>
            <View style={[styles.fill, {width: `${progress * 100}%`}]}/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        height: 8,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        overflow: 'hidden',
    },

    fill: {
        height: '100%',
        backgroundColor: '#4ADE80',
        borderRadius: 10,
    },
});
