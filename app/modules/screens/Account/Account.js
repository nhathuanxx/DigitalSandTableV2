import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicatorComponent,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Platform
} from "react-native";
import i18n from "@app/i18n/i18n";
import { useNavigation } from "@react-navigation/native";
import AddVehicle from "./Component/AddVehicle";
import * as db from "@app/storage/sqliteDbUtils";
import VehicleItem from "./Component/VehicleItem";
import Animated, { FadeIn } from "react-native-reanimated";
import { fetchVehicleViolation } from "@app/libs/ViolationAxios";
import { Helpers, Colors as Themes, Images, Metrics } from "@app/theme";
import LinearGradient from "react-native-linear-gradient";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import storage from "@app/libs/storage";
import AlertConfirm from "../../components/alert/AlertConfirm/AlertConfirm";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";


const Account = ({ }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [isAddVehicle, setIsAddVehicle] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isFetch, setIsFetch] = useState(true);
  const [dataLookup, setDataLookup] = useState({});
  const [isLoadFetchViolations, setIsLoadFetchViolations] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [abortController, setAbortConTroller] = useState(undefined);
  // const [itemHeight, setItemHeight] = useState(0);
  const [isMenuItem, setIsMenuItem] = useState(false);
  const [menuIndex, setMenuIndex] = useState(undefined);
  const [currentItem, setCurrentItem] = useState(undefined);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigation = useNavigation();


  useEffect(async () => {
    if (isFetch) {
      const vehicleDefaultString = await storage.get('vehicleDefault');
      const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
      setCurrentItem(undefined);
      db.getAllVehicle((status, res) => {
        if (status) {
          const defaultVehicle = res.filter(item => item.plate_number_formatted === vehicleDefault.plateNumberFormatted);
          const otherVehicles = res.filter(item => item.plate_number_formatted !== vehicleDefault.plateNumberFormatted);
          const dataSort = defaultVehicle.concat(otherVehicles);
          setVehicles(dataSort);
          setIsFetch(false);
        }
      });

    }
  }, [isFetch]);

  useEffect(() => {
    if (menuIndex !== undefined) {
      setIsMenuItem(true);
    } else {
      setTimeout(() => {
        setIsMenuItem(false);
      }, 200)
    }
  }, [menuIndex]);

  useEffect(() => {
    if (isLoadFetchViolations && abortController) {
      fetchVehicleViolation(dataLookup.plate_number_formatted, dataLookup.id, dataLookup.category_id, abortController)
        .then(success => {
          if (success) {
            setIsLoadFetchViolations(false);
            setIsFetch(true);
            navigation.navigate(
              'Violation',
              { vehicleId: dataLookup.id, plateNumberFormatted: dataLookup.plate_number_formatted, categoryId: dataLookup.category_id }
            );
          }
          else {
            setIsLoadFetchViolations(false);
            setIsFetchError(true);
          }
        })
        .catch(error => {
          if (error.message !== 'canceled') {
            setIsLoadFetchViolations(false);
            setIsFetchError(true);
          }
        })
      return () => {
        abortController.abort();
      };
    }
  }, [isLoadFetchViolations, abortController]);

  const handleBackScreen = () => {
    navigation.navigate('Overview');
  }

  const handleOnAddVehicle = () => {
    setCurrentItem(undefined);
    setIsAddVehicle(true);
    setIsMenuItem(false);
    setMenuIndex(undefined);
    setIsFetch(false);
  }
  const handleOnCloseAddVehicle = useCallback(() => {
    setIsAddVehicle(false);
    setIsFetch(true);
  }, []);

  const handleDeleteVehicle = useCallback(async () => {
    db.deleteVehicle(currentItem);
    const vehicleDefaultString = await storage.get('vehicleDefault');
    const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
    if (vehicleDefault && vehicleDefault.plateNumberFormatted === currentItem.plate_number_formatted) {
      db.getFirstVehicle((status, data) => {
        if (data !== undefined) {
          const vehicleDefaultNew = JSON.stringify({
            plateNumberFormatted: data.plate_number_formatted,
            categoryId: data.category_id
          })
          // console.log('set default -------------- ', vehicleDefault);
          storage.set('vehicleDefault', vehicleDefaultNew)
        } else {
          storage.remove('vehicleDefault')
        }
      })
    }
    setIsMenuItem(false);
    setIsFetch(true);
    setMenuIndex(undefined);
    setCurrentItem(undefined);
    setIsConfirmDelete(false);
  }, [currentItem])

  const handleUpdateVehicle = useCallback(async () => {
    setMenuIndex(undefined);
    setIsMenuItem(false);
    const vehicleDefaultString = await storage.get('vehicleDefault');
    const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
    console.log('vehicleDefault - ----- ', vehicleDefault);
    const currentPlateNumber = currentItem.plate_number_formatted;
    console.log('currentItem - ----- ', currentItem);
    const item = { ...currentItem, default: vehicleDefault.plateNumberFormatted === currentPlateNumber }
    setCurrentItem(item);
    setIsAddVehicle(true);
    // console.log('current data: ------ ', item);
  }, [currentItem])

  const handleCloseAlert = () => {
    setAbortConTroller(null);
    setIsLoadFetchViolations(false);
    setIsFetchError(false);
    setIsFetch(true);
    setIsConfirmDelete(false);
    handleCloseMenu();
  }

  const handleShowConfirm = () => {
    setIsConfirmDelete(true);
  }

  const handleLookup = useCallback((data) => {
    setDataLookup(data);
    setIsLoadFetchViolations(true);
    setIsFetch(false);
    const newController = new AbortController();
    setAbortConTroller(newController);
  }, [])

  const handleShowMenuItem = (data, index, status) => {
    if (status) { // bật
      setMenuIndex(index);
      setCurrentItem(data)
    } else { //tắt
      setMenuIndex(undefined);
      setCurrentItem(undefined)
    }
    setIsMenuItem(prev => !prev);
  }

  const handleCloseMenu = () => {
    setIsMenuItem(false);
    setMenuIndex(undefined);
    setCurrentItem(undefined);
  }

  const onScroll = (e) => {
    if (isMenuItem) {
      handleCloseMenu();
    }
    setScrollY(e.nativeEvent.contentOffset.y)
  }

  const renderAddVehicle = () => (
    <AddVehicle
      currentData={currentItem}
      handleOnCloseAddVehicle={handleOnCloseAddVehicle}
    />
  )

  const renderHeaderAccount = (insets) => (
    <LinearGradient style={[
      styles.headerAccount,
      {
        paddingTop: insets.top,
        paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left - Metrics.icon : 0
      }
    ]}
      colors={[Colors.black, Colors.secondaryBackground]}
    >
      <TouchableOpacity
        style={styles.btnBack}
        onPress={handleBackScreen}
      >
        <Image style={styles.iconStyle} source={Images.arrowLocation} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{i18n.t(`account.name`)}</Text>
    </LinearGradient>
  )

  const renderMenu = () => (
    <Animated.View
      style={[styles.menuBox, { top: (isPortrait ? Metrics.large * 2 : 0) * (menuIndex * 2 + 1) + Metrics.medium * 2 - scrollY }]}
      entering={FadeIn.duration(200)}
    // exiting={FadeOut.duration(200)}
    >
      <TouchableOpacity style={[styles.menuItemBtn]} onPress={handleShowConfirm}>
        <Text style={styles.menuItemBtnText}>{i18n.t(`account.attributes.delete`)}</Text>
        <Image source={Images.delete_product} style={[styles.iconStyle, styles.iconBlue]} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItemBtn]} onPress={handleUpdateVehicle}>
        <Text style={styles.menuItemBtnText}>{i18n.t(`account.attributes.edit`)}</Text>
        <Image source={Images.edit_product} style={[styles.iconStyle, styles.iconBlue]} />
      </TouchableOpacity>
    </Animated.View >
  );


  const handleOnPressNavbarItem = (item) => {
    navigation.navigate(item.name, { title: item.title });
  }


  const getNavbarItems = () => {
    return [
      {
        imageSource: Images.camera,
        title: 'Camera giao thông',
        name: 'Province'
      },
      // {
      //   imageSource: Images.user,
      //   title: i18n.t("overview.attributes.account"),
      //   name: 'SearchScreen'
      // },
      {
        imageSource: Images.movingHistory,
        title: i18n.t("account.attributes.moveHistory"),
        name: 'MoveHistory'

      },
    ]
  }

  const navbarItems = useMemo(getNavbarItems, []);

  const renderNavbar = () => (
    <View style={styles.navbar}>
      {navbarItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.btnNavbarItem}
          onPress={() => handleOnPressNavbarItem(item)}
        >
          <View style={styles.navbarViewIcon}>
            <Image source={item.imageSource} style={styles.navbarIcon} />
          </View>
          <Text style={styles.navbarItemText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderVehicleList = () => {
    return (
      <View style={styles.myVehicleArea}>
        <View style={styles.myVehicleHeader}>
          <View style={styles.iconCar}>
            <Image style={[styles.iconStyle, styles.iconBlue]} source={Images.icCar} />
          </View>
          <Text style={styles.myVehicleText}>{i18n.t(`account.attributes.myCar`)}</Text>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={handleOnAddVehicle}
          >
            <Text style={styles.btnAddText}>+ {i18n.t(`account.attributes.addVehicle`)}</Text>
          </TouchableOpacity>
        </View>
        {vehicles.length <= 0 ?
          (
            <>
              <View style={styles.line}></View>
              <View style={styles.listEmpty}>
                <Text style={styles.emptyText}>{i18n.t(`account.attributes.emptyDesc`)}</Text>
              </View>
            </>
          ) : (
            // <View style={{ flex: 1 }}>
            <ScrollView onScroll={(e) => onScroll(e)} style={styles.vehicleList}>
              <Pressable style={[styles.vehicleListContent]}>
                {vehicles.map((item, index) => (
                  renderVehicleItem(item, index)
                ))}
              </Pressable>
              {/* <View style={styles.footerList}></View> */}
            </ScrollView>
            // </View>
          )
        }
        {isMenuItem && renderMenu()}
      </View>
    )
  }

  const renderVehicleItem = (vehicle, index) => (
    <VehicleItem
      data={vehicle}
      handleLookup={handleLookup}
      handleShowMenuItem={handleShowMenuItem}
      index={index}
      key={vehicle.id}
      isMenu={index === menuIndex ? true : false}
      handleCloseMenu={handleCloseMenu}
    />
  )

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
  const renderConfirmAlert = () => {
    return (
      <AlertConfirm
        iconSoucre={Images.alert}
        title={i18n.t("account.alert.confirm")}
        body={i18n.t("account.alert.deleteConfirm")}
        handleCofirm={handleDeleteVehicle}
        handleCancel={handleCloseAlert}
      />
    )
  }


  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleCloseMenu}
          >
            {renderHeaderAccount(insets)}
            <View style={[
              styles.content,
              { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.small }
            ]}>
              {renderNavbar()}
              {renderVehicleList()}
            </View>
            {isAddVehicle && renderAddVehicle()}
            {isLoadFetchViolations && renderLoadingModalAlert()}
            {/* {isFetchSuccess && renderViolationModalAlert()} */}
            {isFetchError && renderErrorModalAlert()}
            {isConfirmDelete && renderConfirmAlert()}
          </View>
        </>
      )}
    </SafeAreaInsetsContext.Consumer >
  )


}

export default Account;
