import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import i18n from "@app/i18n/i18n";
import Animated, { FadeIn } from "react-native-reanimated";
import { Images, Colors as Themes } from "@app/theme";
import * as db from "@app/storage/sqliteDbUtils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SANCTIONED, UNSANCTIONED } from "@app/config/constants";

const AnimatedTouchacbleOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const VehicleItem = ({ data, handleLookup, handleShowMenuItem, isMenu, index, handleCloseMenu }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  // console.log('data: ', data);
  // const [isMenu, setIsMenu] = useState(false);
  const [unsanctionedCount, setUnsanctionedCount] = useState(0);
  const [sanctionedCount, setSanctionedCount] = useState(0);

  const navigation = useNavigation();

  const isFocused = useIsFocused();

  useEffect(() => {
    const setViolationCount = async () => {
      try {
        const unsanctioned = await db.getViolationCountByStatusAndVehicleId(data.id, UNSANCTIONED);
        const sanctioned = await db.getViolationCountByStatusAndVehicleId(data.id, SANCTIONED);
        setSanctionedCount(sanctioned);
        setUnsanctionedCount(unsanctioned);
      } catch (error) {
        console.log('error violation count VehicleItem ----- ', error.message);
      }
    }

    if (isFocused) {
      setViolationCount();
    }
  }, [isFocused]);

  const onLookup = () => {
    handleLookup(data);
  }
  const onTouch = () => {
    if (isMenu) {
      handleCloseMenu();
    }
  }

  const renderFooterItem = () => {
    return (
      <>
        {sanctionedCount + unsanctionedCount === 0 ? (
          <TouchableOpacity style={styles.footerItem}
            onPress={() => navigation.navigate('Violation',
              { vehicleId: data.id, plateNumberFormatted: data.plate_number_formatted, categoryId: data.category_id })}
          >
            <Text style={[styles.violationText, styles.textGrey]}>
              {i18n.t(`account.attributes.nonViolation`)}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.footerItem}
            onPress={() => navigation.navigate('Violation',
              { vehicleId: data.id, plateNumberFormatted: data.plate_number_formatted, categoryId: data.category_id })}
          >
            <Text style={[styles.violationText, styles.textBlue]}>
              {sanctionedCount ? sanctionedCount : 0} {i18n.t(`account.attributes.sanctionedError`)}
            </Text>
            <View style={styles.lineVertical}></View>
            <Text style={[styles.violationText, styles.textRed]}>
              {unsanctionedCount ? unsanctionedCount : 0} {i18n.t(`account.attributes.unsanctionedError`)}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  }

  return (
    <Pressable
      onPress={handleCloseMenu}
    >
      <Animated.View
        entering={FadeIn}
      >
        <View style={styles.line}></View>
        <View style={styles.vehicleItem}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{data.vehicle_name}</Text>
            <Text style={styles.textGrey}>{data.plate_number}</Text>
            <Text style={styles.textGrey}>{i18n.t(`account.categoryVehicle.${data.category_name}`)}</Text>
          </View>
          {/* Animated. */}
          <TouchableOpacity style={styles.btnLookup}
            onPress={onLookup}
          >
            <Image source={Images.greySearch} style={[styles.iconMedium, styles.iconGrey]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDetail}
            onPress={() => handleShowMenuItem(data, index, !isMenu)} // index, isMenu: trạng thái menu hiện tại
          >
            <Image style={[styles.iconMedium, styles.iconGrey]} source={Images.thereVertical} />
          </TouchableOpacity>
        </View>
        {renderFooterItem()}
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(VehicleItem);