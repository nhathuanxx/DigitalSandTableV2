import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import i18n from "@app/i18n/i18n";
import { Images } from "@app/theme";
import { useNavigation } from "@react-navigation/native";
import ViolationInfo from "./ViolationInfo";
import { Colors as Themes, Helpers, Metrics } from "@app/theme";
import { fetchVehicleViolation } from "@app/libs/ViolationAxios";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import analytics from '@react-native-firebase/analytics';

const Violation = ({ route }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const { vehicleId, plateNumberFormatted, categoryId } = route.params;
  const [isAtTop, setIsAtTop] = useState(true);
  const [isFetchViolations, setIsFetchViolations] = useState(false);
  const [abortController, setAbortController] = useState(undefined)
  const [isReLoad, setIsReLoad] = useState(true);
  const [isFetchError, setIsFetchError] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const logSelectContent = async () => {
      await analytics().logEvent('ViolationEvent', {
        content: 'Violation',
        item_id: 'ViolationId',
      });
    }

    logSelectContent();

    if (isFetchViolations && abortController) {
      // console.log('----------------- ' + plateNumberFormatted + '   ' + vehicleId + ' - ' + categoryId);
      fetchVehicleViolation(plateNumberFormatted, vehicleId, categoryId, abortController)
        .then(success => {
          if (success) {
            setIsFetchViolations(false);
            setIsReLoad(true);
          }
          else {
            setIsFetchViolations(false);
            setIsFetchError(true);
            setIsReLoad(true);
          }
        })
        .catch(error => {
          setIsReLoad(true);
          if (error.message !== 'canceled') {
            setIsFetchViolations(false);
            setIsFetchError(true);
          }
        })
      return () => {
        abortController.abort();
      };
    }
  }, [isFetchViolations, abortController]);

  const handleOnSroll = useCallback((isTop) => {
    setIsAtTop(isTop);
  }, [])

  const handleOnDataLookup = () => {
    setIsFetchViolations(true);
    setIsReLoad(false);
    const newController = new AbortController();
    setAbortController(newController);
  }

  const renderHeader = () => (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View
          style={[
            styles.header,
            !isAtTop ? styles.bgrWhite : {},
            { paddingTop: (insets.top) }
          ]}
        >
          <TouchableOpacity
            style={styles.btnCloseScreen}
            onPress={() => navigation.navigate('Account')}
          >
            <Image style={[styles.iconRegular, styles.iconColor]} source={Images.arrowBack} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer >
  );

  const renderFooter = () => (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={[styles.footer, { paddingBottom: (insets.bottom + Metrics.small) }]}>
          <View style={styles.btnFooterArea}>
            <TouchableOpacity style={[styles.btnFooter, { backgroundColor: Colors.coralRed }]}
              onPress={handleOnDataLookup}
            >
              <Text style={styles.btnFooterText}>{i18n.t(`account.attributes.loadNewData`)}</Text>
            </TouchableOpacity>
            {/* <View style={styles.distanceView}></View> */}
            {/* <TouchableOpacity style={[styles.btnFooter, { backgroundColor: Colors.royalBlue }]}>
          <Text style={styles.btnFooterText}>Tra đăng kiểm</Text>
        </TouchableOpacity> */}
          </View>
          <Text style={styles.footerText}>{i18n.t(`account.attributes.source`)}</Text>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer >
  )

  const handleCloseAlert = () => {
    setAbortController(null);
    setIsFetchViolations(false);
    setIsFetchError(false);
  }

  const renderErrorModalAlert = () => {
    return (
      <AlertError
        title={i18n.t("alert.attributes.error")}
        handleClose={handleCloseAlert}
        iconSoucre={Images.alert}
      />
    )
  }
  const renderLoadingModalAlert = () => {
    return (
      <AlertError
        title={i18n.t("alert.attributes.loading")}
        handleClose={handleCloseAlert}
        isLoading={true}
      />
    )
  }

  return (
    // <LinearGradient style={styles.container} colors={[Colors.mistyRose, Colors.white]}>
    <View style={styles.container}>
      <ViolationInfo vehicleId={vehicleId} handleOnSroll={handleOnSroll}
        isReLoad={isReLoad}
        plateNumberFormatted={plateNumberFormatted}
      />
      {renderHeader()}
      {renderFooter()}
      {isFetchViolations && renderLoadingModalAlert()}
      {isFetchError && renderErrorModalAlert()}
    </View>
  )
}

export default Violation;