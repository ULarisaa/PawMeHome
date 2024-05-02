import React, { useEffect, useState } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import { useDynamicStyles } from './styles';

const LoadingScreen = () => {
    const styles = useDynamicStyles(); // Folosește hook-ul pentru a obține stilurile adaptate
    const [fillAnimation] = useState(new Animated.Value(0)); // Starts empty

    useEffect(() => {
        // Sequence: Fill down, then disappear upwards
        const animationSequence = Animated.sequence([
            Animated.timing(fillAnimation, {
                toValue: 1, // Fill down
                duration: 1500, // Duration 3 seconds
                useNativeDriver: false, 
            }),
            Animated.timing(fillAnimation, {
                toValue: 0, // Disappear upwards
                duration: 1500, // Duration 3 seconds
                useNativeDriver: false,
            }),
        ]);


        Animated.loop(animationSequence).start();
    }, [fillAnimation]);

    const coverHeight = fillAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['100%', '0%'], 
    });
    

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../../images/paw.png')} style={styles.logo} />
                <Animated.View style={[styles.cover, { height: coverHeight }]} />
            </View>
        </View>
    );
};

export default LoadingScreen;


