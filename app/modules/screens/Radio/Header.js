import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Linking
} from "react-native";
import { Images } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";

const Header = ({ typeComponent, handleClickRightHeader, nameChannel }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  const handleCloseChannelList = () => {    // header của danh sách kênh, sự kiện đóng
    handleClickRightHeader();
  }
  const handleOpenOnWeb = () => {
    if (!typeComponent) {
      Linking.openURL('https://vov.vn/');
    } else if (nameChannel.includes('vovGT')) {
      Linking.openURL('https://vovgiaothong.vn/');
    } else if (nameChannel.includes('vovTV')) {
      Linking.openURL('https://truyenhinhvov.vn/')
    } else {
      Linking.openURL(`https://${nameChannel}.vov.gov.vn/`);
    }
  }

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerLeft}
          onPress={handleOpenOnWeb}
        >
          {typeComponent ? (
            <Image style={styles.iconLogo}
              source={Images[nameChannel]}
              resizeMode='contain'
            />)
            : (
              <Image style={styles.iconLogo}
                source={Images.logoVov}    // logo vov khi ở ChannelList
                resizeMode='contain'
              />
            )}
          <Text style={styles.headerLeftText}>{i18n.t("radio.attributes.openSound")}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {typeComponent ? ( // = true khi component RadioBox, = false khi component ChannelList
            // <TouchableOpacity style={styles.headerRightBtn}>
            //   <Text style={styles.headerRightBtnText}>{i18n.t("radio.attributes.audioApps")}</Text>
            // </TouchableOpacity>
            <></>
          )
            : (
              <TouchableOpacity style={styles.headerRightBtn}
                onPress={handleCloseChannelList}
              >
                <Image style={styles.iconStyle}
                  source={Images.close}
                />
              </TouchableOpacity>
            )
          }
        </View>
      </View>
      <View style={styles.line}></View>
    </View>
  )
}

export default Header;