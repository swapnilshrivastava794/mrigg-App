import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Skeleton = ({ width, height, style, borderRadius = 8 }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.3, { duration: 1000 }),
                withTiming(0.7, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.skeleton, { width, height, borderRadius }, style, animatedStyle]}>
             <LinearGradient
                colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        </Animated.View>
    );
};

export default Skeleton;

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
});
