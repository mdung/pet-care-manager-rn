import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        style,
      ]}
    />
  );
};

export const PetCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardSkeleton}>
      <LoadingSkeleton width={60} height={60} style={styles.avatarSkeleton} />
      <View style={styles.contentSkeleton}>
        <LoadingSkeleton width="60%" height={20} style={styles.titleSkeleton} />
        <LoadingSkeleton width="40%" height={16} style={styles.subtitleSkeleton} />
        <LoadingSkeleton width="30%" height={14} style={styles.subtitleSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  cardSkeleton: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarSkeleton: {
    borderRadius: 30,
    marginRight: 12,
  },
  contentSkeleton: {
    flex: 1,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 4,
  },
});

