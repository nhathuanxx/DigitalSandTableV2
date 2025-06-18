
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "@app/modules/components/context/ThemeContext";

import { Colors as Themes, Helpers, Images, Metrics, Fonts } from "@app/theme";
const CustomCallout = ({ title }) => {
    const { isDarkTheme } = useTheme(); // Lấy thông tin về chế độ tối
    const styles = createStyles(isDarkTheme); // Tạo kiểu dáng dựa trên chế độ tối

    return (
        <View style={styles.calloutContainer}>
            <Text
                numberOfLines={8} ellipsizeMode="tail"
                style={styles.calloutTitle}>{title}</Text>
        </View>
    );
};

// Hàm tạo styles dựa trên chế độ tối

const createStyles = (isDarkTheme) => {
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    return StyleSheet.create({
        calloutContainer: {
            maxHeight: 200,
            width: 150,
            ...Helpers.crossCenter,
            backgroundColor: Colors.background,
            marginTop: Metrics.tiny,
            padding: Metrics.tiny,
            borderRadius: Metrics.small
        },
        calloutTitle: {
            fontSize: 15,
            color: Colors.text,
            fontWeight: '500',
        },
    });
};

export default CustomCallout;
