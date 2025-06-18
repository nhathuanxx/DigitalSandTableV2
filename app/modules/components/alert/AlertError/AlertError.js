import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    FlatList,
    ActivityIndicator
} from "react-native";
import { Images, Colors as Themes } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { useOrientation } from "@app/modules/components/context/OrientationContext";


const AlertError = ({ title, body, handleClose, iconSoucre, isLoading }) => {
    const { isDarkTheme } = useTheme();
    const { isPortrait, dimensions } = useOrientation();
    const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
    const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [handleClose]);
    return (
        <Pressable
            style={styles.container}
            onPress={handleClose}
        >
            <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
                <View style={styles.body}>
                    {isLoading ?
                        (
                            <ActivityIndicator size='large' color={Colors.blueText} style={styles.image} />
                        ) : (
                            iconSoucre !== undefined ? (
                                <Image source={iconSoucre} style={styles.image} />
                            ) : (
                                <Image source={Images.alert} style={styles.image} />
                            )
                        )}
                    <View style={styles.bodyRight}>
                        {title !== undefined && <Text style={styles.text}>{title}</Text>}
                        {body !== undefined && <Text style={styles.bodyText}>{body}</Text>}
                    </View>
                </View>
            </Pressable>
        </Pressable>
    );

};


export default React.memo(AlertError);