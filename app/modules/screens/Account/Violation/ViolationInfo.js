import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";
import i18n from "@app/i18n/i18n";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as db from "@app/storage/sqliteDbUtils";
import ViolationCard from "./ViolationCard";
import LinearGradient from "react-native-linear-gradient";
import { Colors as Themes, Images, Metrics } from "@app/theme";
import { UNSANCTIONED } from "@app/config/constants";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";

const ViolationInfo = ({ vehicleId, handleOnSroll, isReLoad, plateNumberFormatted }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [violations, setViolations] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [atTop, setAtTop] = useState(true);
  const [isLoad, setIsLoad] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          console.log('re load ------------ ' + vehicleId + ' - ' + plateNumberFormatted);
          const violations = await db.getAllViolationByVehicleId(vehicleId);
          setViolations(violations);

          const vehicle = await db.getVehicleById(vehicleId);
          setVehicle(vehicle ? vehicle : {});
          setIsLoad(false);

        } catch (error) {
          console.log('error violation ==== ', error.message);
        }
      };

      if (isReLoad) {
        fetchData();
      }
    }, [isReLoad, vehicleId])
  );

  const onScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 0 && atTop) {
      setAtTop(false);
      handleOnSroll(false);
    }

    if (scrollY <= 0 && !atTop) {
      setAtTop(true);
      handleOnSroll(true);
    }
  }

  const renderTitle = () => {
    const count = violations.length;
    const unsanctionedCount = violations.filter(item => item.status === UNSANCTIONED).length;
    const sanctionedCount = count - unsanctionedCount;
    return (
      <LinearGradient style={styles.title}
        colors={count === 0 && unsanctionedCount === 0 ?
          [Colors.backgroundGreen, Colors.backgroundGrey] : [Colors.backgroundPink, Colors.backgroundGrey]}
      >
        {isLoad ? (
          <ActivityIndicator size={'large'} color={Colors.blueText} />
        ) : (
          <>
            <Text style={styles.plateNumber}>{vehicle.plate_number}</Text>
            {count === 0 ? (
              <>
                <Text style={[styles.violationTitle, styles.textBlue]}>
                  {i18n.t(`account.attributes.nonViolation`, { count })}
                </Text>
                <Text style={styles.updateTime}>
                  {i18n.t(`account.attributes.updateTime`, { time: vehicle.last_violation_update })}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.violationTitle}>
                  {i18n.t(`account.attributes.violation`, { count })}
                </Text>
                <Text style={styles.updateTime}>
                  {i18n.t(`account.attributes.updateTime`, { time: vehicle.last_violation_update })}
                </Text>
                <View style={styles.violationDetail}>
                  <Text style={styles.violationText}>
                    {sanctionedCount ? sanctionedCount : 0} {i18n.t(`account.attributes.sanctionedError`).toLowerCase()}
                  </Text>
                  <View style={styles.lineVertical}></View>
                  <Text style={[styles.violationText, styles.textRed]}>
                    {unsanctionedCount ? unsanctionedCount : 0} {i18n.t(`account.attributes.unsanctionedError`).toLowerCase()}
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      </LinearGradient>
    )
  }

  return (
    <ScrollView
      onScroll={onScroll}
      style={styles.content}
    >
      {renderTitle()}
      {!isLoad &&
        <View style={styles.listArea}>
          {violations.map((item, index) => (
            <ViolationCard violation={item} key={item.id} index={index}
              plateNumberFormatted={plateNumberFormatted}
            />
          ))}
        </View>
      }
      <View style={styles.footerList}></View>
    </ScrollView>
  )
}

export default React.memo(ViolationInfo);