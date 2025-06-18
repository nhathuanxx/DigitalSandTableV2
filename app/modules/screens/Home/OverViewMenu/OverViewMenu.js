import React, { Fragment, useState, useRef } from "react";
// import { Text, View, SafeAreaView, Image } from "react-native";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { connect } from "react-redux";
import { Helpers, Images, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import createHorizontalStyles from "./horizontalStyles";

const OverViewMenu = ({ isCloseVisible, handleClosePress, handleShowRadio, handleOpenSettings }) => {
  if (!isCloseVisible) return null;

  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = isPortrait ? createStyles(isDarkTheme) : createHorizontalStyles(isDarkTheme);

  const navigation = useNavigation();

  const handleSettingClick = () => {
    handleOpenSettings();
  }
  const handleAccountClick = () => {
    navigation.navigate('Account');

  }
  const handleFavoriteClick = () => {
    navigation.navigate('FavoriteAddress');

  }
  return (

    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <>
          <View style={[
            styles.viewIconBotRightContainer,
            {
              // bottom: insets.bottom + (isPortrait ? Metrics.medium * 2 : 0),
              // right: isPortrait ? Metrics.small : (Platform.OS === 'ios' ? insets.top : Metrics.small)
            }
          ]}>
            <TouchableOpacity onPress={handleFavoriteClick}
            >
              <View style={styles.viewIconBotRightContentMenu}>
                <Text style={styles.textStyle}>{i18n.t("overview.attributes.favouriteMenu")}</Text>
                <View style={styles.iconStyleMMenu}>
                  <Image style={styles.iconStyle}
                    source={Images.star}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.spacerHeight}></View>
            <TouchableOpacity
              onPress={handleAccountClick}
            >
              <View style={styles.viewIconBotRightContentMenu}>
                <Text style={styles.textStyle}>{i18n.t("overview.attributes.account")}</Text>
                <View style={styles.iconStyleMMenu}>
                  <Image style={styles.iconStyle}
                    source={Images.account}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.spacerHeight}></View>
            <TouchableOpacity
              onPress={handleSettingClick}>
              <View style={styles.viewIconBotRightContentMenu}>
                <Text style={styles.textStyle}>{i18n.t("overview.attributes.setting")}</Text>
                <View style={styles.iconStyleMMenu}>
                  <Image style={styles.iconStyle}
                    source={Images.setting}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.spacerHeight}></View>
            <TouchableOpacity onPress={handleClosePress}>
              <View style={[styles.viewIconBotRightContentMenu, styles.view_icon_close]}>
                <View style={styles.iconStyleMenuClose}>
                  <Image
                    style={[styles.iconStyle, styles.iconBlack]}
                    source={Images.close}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaInsetsContext.Consumer >
  );
};









function mapStateToProps(state) {
  return {

  };
}
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(OverViewMenu);
