import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const InlineImageEditor = ({ imageUri }) => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      scale.value = context.startScale * event.scale;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
    <PinchGestureHandler onGestureEvent={pinchHandler} onHandlerStateChange={({ nativeEvent }) => {
      if (nativeEvent.state === State.END) {
        focalX.value = withTiming(0);
        focalY.value = withTiming(0);
      }
    }}>
      <Animated.View style={styles.container}>
        <Animated.Image source={{ uri: imageUri }} style={[styles.image, animatedStyle]} resizeMode="contain" />
      </Animated.View>
    </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default InlineImageEditor;
