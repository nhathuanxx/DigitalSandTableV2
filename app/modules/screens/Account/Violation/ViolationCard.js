import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import * as appAction from "@app/storage/action/app";
import i18n from "@app/i18n/i18n";
import { Images, Colors as Themes } from "@app/theme";
import { useGetPlaceDetailFromAddress } from "@app/hooks/place_detail.hook";
import { useNavigation } from "@react-navigation/native";
import { haversineDistance } from '@app/libs/utils.js';
import { UNSANCTIONED } from "@app/config/constants";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";

const ViolationCard = ({ violation, index, myLocation, updatePlace, plateNumberFormatted }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const useFetchGetPlaceDetailFromAddress = useGetPlaceDetailFromAddress();

  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState([105.79829597455202, 21.013715429594125]);


  useEffect(() => {
    if (myLocation != undefined) {
      setCurrentLocation(myLocation)
    }
  }, []);

  const handleCall = () => {
    const url = `tel:${violation.contact_number}`;

    // Mở ứng dụng gọi điện thoại
    Linking.openURL(url).catch(err => console.error('Error:', err));
  }

  const handleShowLocation = async () => {
    const params = {
      address: violation.place_of_violation,
    };

    try {
      const response = await useFetchGetPlaceDetailFromAddress.mutateAsync(params);
      let relatedLocations = response.results || [];
      if (relatedLocations.length > 0) {
        const placeLocation = [relatedLocations[0].geometry.location.lng, relatedLocations[0].geometry.location.lat];
        const distance = haversineDistance(myLocation, placeLocation).toFixed(2);
        const { commune, district, province } = relatedLocations[0].compound;
        const item = {
          structured_formatting: {
            main_text: violation.place_of_violation
          },
          description: `${commune}, ${district}, ${province}`,
          place_id: relatedLocations[0].place_id,
          distance: distance,
          location: relatedLocations[0].geometry.location
        }
        const currentScreen = {
          name: 'Violation',
          params: {
            vehicleId: violation.vehicle_id,
            plateNumberFormatted: plateNumberFormatted
          }
        }
        navigation.navigate('SearchDirections', {
          mainText: violation.place_of_violation,
          description: relatedLocations[0].address_components.map(item => item.long_name).join(' '),
          distance: distance || 0,
          item: item,
          relatedLocations: [item],
          prevScreen: currentScreen
        });
        updatePlace(relatedLocations[0])
      } else {
        console.log('erorr:-----', relatedLocations);
      }
    } catch (error) {
      Alert.alert(
        i18n.t("alert.attributes.warning"),
        error.message || i18n.t("alert.attributes.warning"),
        [
          { text: i18n.t("alert.attributes.oke") },
        ]
      );
    }
  }

  return (
    <View style={styles.card}>
      <View style={[
        styles.cardHeader,
        violation.status === UNSANCTIONED ? { backgroundColor: Colors.backgroundPink } : { backgroundColor: Colors.backgroundGreen }
      ]}
      >
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardTitle}>{i18n.t(`account.attributes.violationNumber`, { index: index + 1 })}</Text>
          <Text style={styles.violationTime}>{i18n.t(`account.attributes.timeOfViolation`, { time: violation.time_of_violation })}</Text>
        </View>
        {violation.status === UNSANCTIONED
          ? (<Text style={[styles.status, styles.statusRed]}>{i18n.t(`account.attributes.unsanctionedError`)}</Text>)
          : (<Text style={[styles.status, styles.statusBlue]}>{i18n.t(`account.attributes.sanctionedError`)}</Text>)
        }
      </View>
      <View style={styles.cardContent}>
        <TouchableOpacity style={styles.cardItem} onPress={handleShowLocation}>
          <Text style={styles.titleItem}>{i18n.t(`account.attributes.placeOfiolation`)}</Text>
          <View style={styles.plateLocation}>
            <View style={styles.locationBtn}>
              <Image source={Images.locationBlue} style={[styles.iconMedium, styles.iconBlue]} resizeMode="contain" />
            </View>
            <Text style={[styles.textGrey, styles.plateLocationText]}>{violation.place_of_violation}</Text>
          </View>
        </TouchableOpacity>
        {violation.violation_details !== "" &&
          <>
            <View style={styles.line}></View>
            <View style={styles.cardItem}>
              <Text style={styles.titleItem}>{i18n.t(`account.attributes.violationDetail`)}</Text>
              <Text style={styles.textGrey}>{violation.violation_details}</Text>
            </View>
          </>
        }
        <View style={styles.line}></View>
        <View style={styles.cardItem}>
          <Text style={styles.titleItem}>{i18n.t(`account.attributes.unitName`)}</Text>
          <Text style={styles.textGrey}>{violation.unit_name}</Text>
        </View>
        <View style={styles.line}></View>
        <View style={[styles.cardItem, styles.contactItem]}>
          <Text style={styles.titleItem}>{i18n.t(`account.attributes.phoneNumber`)}</Text>
          <TouchableOpacity onPress={handleCall} style={styles.contactBtn}>
            <Image source={Images.phone_red} style={styles.iconRegular} />
            <Text style={styles.contactText}>{violation.contact_number}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.line}></View>
        <View style={styles.cardItem}>
          <Text style={styles.titleItem}>{i18n.t(`account.attributes.placeOfSettlement`)}</Text>
          {violation.settlement_details.map((settlement, index) => (
            <View key={index}>
              <Text style={styles.textGrey}>{settlement.place_of_settlement}</Text>
              {settlement.contact_number !== '' &&
                <Text style={styles.textGrey}>{i18n.t(`account.attributes.phoneNumber`)}: {settlement.contact_number}</Text>
              }
              {settlement.address_of_settlement !== '' &&
                <Text style={styles.textGrey}>{i18n.t(`account.attributes.addressOfSettlement`,
                  { address: settlement.address_of_settlement })}</Text>
              }
            </View>
          ))}
        </View>
        {/* <View style={styles.line}></View> */}
      </View>
    </View>
  )
}

function mapStateToProps(state) {
  return {
    place: state.app.place,
    myLocation: state.app.myLocation,
  };
}
const mapDispatchToProps = (dispatch) => ({
  updatePlace: (place) => dispatch(appAction.place(place)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ViolationCard));