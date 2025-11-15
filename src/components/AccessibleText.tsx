import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface AccessibleTextProps extends TextProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'text' | 'header' | 'link' | 'button';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  accessible = true,
  accessibilityLabel,
  accessibilityRole = 'text',
  fontSize = 'medium',
  style,
  ...props
}) => {
  const fontSizeMap = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  };

  return (
    <Text
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityRole={accessibilityRole}
      style={[styles.text, { fontSize: fontSizeMap[fontSize] }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
  },
});

