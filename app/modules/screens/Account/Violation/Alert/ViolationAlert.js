import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import i18n from "@app/i18n/i18n";
import { Images, Metrics } from "@app/theme";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideInLeft, SlideOutDown } from "react-native-reanimated";
import * as db from "@app/storage/sqliteDbUtils";
import storage from "@app/libs/storage";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import { Platform } from "react-native";


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ViolationAlert = ({ handleCloseViolationAlert, unsanctionedCount }) => {
  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);

  const [vehicle, setVehicle] = useState(undefined);
  const [isSetting, setIsSetting] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!isSetting) {
      const timer = setTimeout(() => {
        handleCloseViolationAlert();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isSetting]);

  useFocusEffect(
    useCallback(() => {
      const setVehicleAlert = async () => {
        const vehicleDefaultString = await storage.get('vehicleDefault');
        const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
        if (vehicleDefault) {
          db.getVehicleByPlateNumber(vehicleDefault.plateNumberFormatted, vehicleDefault.categoryId, (status, data) => {
            if (status) {
              setVehicle(data);
            }
          })
        }
      }
      setVehicleAlert();
    }, [])
  )
  const handleShowSetting = () => {
    setIsSetting(true);
    // handleShowSetting();
  }
  const handleCloseSetting = () => {
    setIsSetting(false);
    // handleShowSetting();
  }

  const handleOnSeeNow = () => {
    // console.log('vehicle ===== ', vehicle);
    navigation.navigate('Violation',
      { vehicleId: vehicle.id, plateNumberFormatted: vehicle.plate_number_formatted, categoryId: vehicle.category_id })
  }

  const getOptions = () => {
    return [
      {
        id: '1',
        name: 'threeDays',
        value: 3 * 86400 * 1000 // ms
      },
      {
        id: '2',
        name: 'oneWeek',
        value: 7 * 86400 * 1000 // ms
      },
      {
        id: '3',
        name: 'oneMonth',
        value: 30 * 86400 * 1000 // ms
      },
      {
        id: '4',
        name: 'threeMonths',
        value: 90 * 86400 * 1000 // ms
      },
      {
        id: '5',
        name: 'forever',
        value: 'Infinity'
      },
    ]
  }

  const options = useMemo(getOptions, []);

  const onPressOption = (item) => {
    const currentTime = new Date().getTime();
    storage.set('violationAlertHideTime', item.value);
    storage.set('lastViolationAlertTime', currentTime);
    setIsSetting(false);
    handleCloseViolationAlert();
  }

  const renderContentSetting = () => (
    <ScrollView>
      <View style={styles.content}>
        {options.map(item => (
          <TouchableOpacity
            style={styles.optionBtn}
            onPress={() => onPressOption(item)}
            key={item.id}>
            <Text style={[styles.settingText, item.name === 'forever' ? styles.redText : {}]}>
              {i18n.t(`account.alert.${item.name}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <>
          <View style={[
            styles.violationAlertContainer,
            {
              top: isPortrait ? (insets.top + Metrics.tiny) : (Platform.OS === 'ios' ? Metrics.small : insets.top),
              left: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small,
              width: !isPortrait ? dimensions.width * 0.45 : null
            }
          ]}>
            <View style={styles.alertContent}>
              <Image style={styles.iconAlert} source={Images.warningBlue} />
              <View style={styles.alertContentRight}>
                <Text style={styles.alertContentText}>{i18n.t(`account.alert.body`, { count: unsanctionedCount })}</Text>
                <TouchableOpacity style={styles.btnSeeNow}
                  onPress={handleOnSeeNow}
                >
                  <Text style={[styles.alertContentText, styles.seeNowText]}>{i18n.t(`account.alert.seeNow`)}</Text>
                  <View style={{ flex: 1 }}></View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnNotShowAgain}
              onPress={handleShowSetting}
            >
              <Text style={[styles.btnNotShowAgainText, isSetting ? styles.textUnderLine : {}]}>
                {i18n.t(`account.alert.notShowAgain`)}
              </Text>
            </TouchableOpacity>
          </View>
          {isSetting &&
            <View style={styles.container}>
              <AnimatedPressable
                style={styles.backdrop}
                onPress={handleCloseSetting}
                entering={FadeIn.duration(300)}
                exiting={FadeOut}
              />

              <Animated.View
                style={styles.alertSettingContainer}
                entering={SlideInDown.duration(200).springify().damping(20)}
                exiting={SlideOutDown}
              >
                <Text style={[styles.title, styles.settingText]}>
                  {i18n.t(`account.alert.notShowAgainAlert`)}
                </Text>
                {renderContentSetting()}
              </Animated.View>

            </View>
          }

        </>
      )}
    </SafeAreaInsetsContext.Consumer >
  )
}

export default ViolationAlert;