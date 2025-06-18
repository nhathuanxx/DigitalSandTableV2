import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { getWeatherIcon } from "../../../components/config/weather_Icon"
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { Colors as Themes, Fonts, Helpers, Images, Metrics } from "@app/theme";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const Weather = ({ temp, icon, customStyles }) => {
    const { isDarkTheme } = useTheme();
    const { isPortrait } = useOrientation();
    const styles = createStyles(isDarkTheme);
    return (
        <SafeAreaInsetsContext.Consumer>
            {(insets) => (
                <>
                    <View style={[
                        styles.viewWeatherIconBottomLeft,
                        {
                            // bottom: (insets.bottom + Metrics.medium * 3),
                            // left: isPortrait ? Metrics.small : (Platform.OS === 'ios' ? insets.top : Metrics.small)
                        }
                    ]}>
                        <TouchableOpacity style={styles.viewWeatherIconBottomLeftContent}>
                            <View style={styles.iconWeather}>
                                {icon ? (
                                    <Image
                                        alt="Weather icon"
                                        source={getWeatherIcon(icon)}
                                        style={styles.iconStyle}
                                        resizeMode='contain'
                                    />
                                ) : (

                                    // <Image
                                    //     alt="Weather icon"
                                    //     source={Images.weather}
                                    //     style={styles.iconStyle}
                                    // />
                                    <Text style={styles.viewWeatherIconTextContent}>-</Text>


                                )}
                            </View>
                            <Text style={styles.viewWeatherIconTextContent}>
                                {temp ? `${Math.round(temp)}°` : '--'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaInsetsContext.Consumer >
    );
};

export default Weather;