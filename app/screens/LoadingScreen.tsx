import React, { useEffect, useState } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

const LoadingScreen = () => {
    const [fillAnimation] = useState(new Animated.Value(0)); // Starts empty

    useEffect(() => {
        // Sequence: Fill down, then disappear upwards
        const animationSequence = Animated.sequence([
            Animated.timing(fillAnimation, {
                toValue: 1, // Fill down
                duration: 1500, // Duration 3 seconds
                useNativeDriver: false, // 'height' is not supported by native driver
            }),
            Animated.timing(fillAnimation, {
                toValue: 0, // Disappear upwards
                duration: 1500, // Duration 3 seconds
                useNativeDriver: false,
            }),
        ]);

        // Loop the sequence indefinitely
        Animated.loop(animationSequence).start();
    }, [fillAnimation]);

    const coverHeight = fillAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'], // Starts full, ends empty
    });

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('./../utils/images/paw.png')} style={styles.logo} />
                <Animated.View style={[styles.cover, { height: coverHeight }]} />
            </View>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF', // Or any background color you prefer
    },
    logoContainer: {
        width: 150, // Adjust based on your logo's size
        height: 150, // Adjust based on your logo's size
        overflow: 'hidden',
        position: 'relative',
    },
    logo: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    cover: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF', 
    },
});
