import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Images } from "@app/theme";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import * as appAction from "@app/storage/action/app";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";

const Header = ({ name, prevScreen, params, updateCameraLocations, updateCameraLocationSelected }) => {
  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const navigation = useNavigation();

  const handleBack = () => {
    updateCameraLocations([]);
    updateCameraLocationSelected([]);
    navigation.navigate(prevScreen, params);
  }

  return (

    <>
      <StatusBar barStyle={isDarkTheme ? "light-content" : "dark-content"} />
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          // <>
          <View style={[styles.header, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.btnBack}
              onPress={handleBack}
            >
              <Image source={Images.arrowLocation} style={styles.iconstyle} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{name}</Text>
          </View>
          // </>
        )}
      </SafeAreaInsetsContext.Consumer >
    </>
  )
}

function mapStateToProps(state) {
  return {
    cameraLocations: state.app.cameraLocation
  };
}
const mapDispatchToProps = (dispatch) => ({
  // updatePlace: (place) => dispatch(appAction.place(place)),
  updateCameraLocations: (cameraLocations) => dispatch(appAction.cameraLocations(cameraLocations)),
  updateCameraLocationSelected: (cameraLocationSelected) => dispatch(appAction.cameraLocationSelected(cameraLocationSelected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Header));