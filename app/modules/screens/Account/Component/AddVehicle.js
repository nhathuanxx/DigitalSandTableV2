import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { useForm, Controller } from 'react-hook-form';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideInLeft } from "react-native-reanimated";
import { Images, Colors as Themes, Helpers } from "@app/theme";
import * as db from "@app/storage/sqliteDbUtils";
import AlertError from "@app/modules/components/alert/AlertError/AlertError";
import storage from "@app/libs/storage";
import { CAR_TYPE, ELECTRICBIKE_TYPE, MOTOR_TYPE } from "@app/config/constants";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";
import { KeyboardAvoidingView } from "react-native";
import DropdownElement from "@app/modules/components/element/DropdownElement";
import SwitchElement from "@app/modules/components/element/SwitchElement";

const AddVehicle = ({ handleOnCloseAddVehicle, currentData }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait } = useOrientation();
  const styles = createStyles(isDarkTheme);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [isDefault, setIsDefault] = useState(false);
  const [isSave, setIsSave] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [alertStatus, setAlertStatus] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(async () => {
    // storage.remove('vehicleDefault');
    if (isLoading && data) {
      const vehicleDefaultString = await storage.get('vehicleDefault');
      console.log('vehicleDefaultString ==== ', vehicleDefaultString);
      const vehicleDefault = vehicleDefaultString ? JSON.parse(vehicleDefaultString) : undefined;
      const plateNumberFormat = formatPlateNumber(data.plateNumber.trim(), data.category.value.categoryId);
      let vehicle = {
        id: currentData ? currentData.id : undefined,
        vehicleName: data.vehicleName.trim(),
        plateNumber: data.plateNumber.trim(),
        plateNumberFormatted: plateNumberFormat.toUpperCase(),
        categoryName: data.category.value.categoryName.trim(),
        categoryId: data.category.value.categoryId,
        vehicleLoad: data.vehicleLoad.trim(),
      }
      console.log("vehicle: --------- ", { ...vehicle, default: data.defaultVehicle });
      // setIsLoading(false);
      if (!currentData) {
        db.insertVehicle(vehicle, (response, message) => {
          setAlertMessage(message);
          setIsSave(response);
          setData(undefined);
          if (response && (data.defaultVehicle || !vehicleDefault)) {
            const vehicleDefaultNew = JSON.stringify({
              plateNumberFormatted: vehicle.plateNumberFormatted,
              categoryId: vehicle.categoryId
            })
            console.log('set default -------------- ', vehicleDefaultNew);
            storage.set('vehicleDefault', vehicleDefaultNew)
          }
          setIsLoading(false);
        });
      } else {
        db.updateVehicle(vehicle, (response, message) => {
          setAlertMessage(message);
          setIsSave(response);
          setData(undefined);
          if (response && (data.defaultVehicle || !vehicleDefault)) {
            const vehicleDefaultNew = JSON.stringify({
              plateNumberFormatted: vehicle.plateNumberFormatted,
              categoryId: vehicle.categoryId
            })
            // console.log('set default -------------- ', vehicleDefaultNew);
            storage.set('vehicleDefault', vehicleDefaultNew)
          }
          setIsLoading(false);
        });
      }
    }
  }, [data, isLoading]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [])

  const formatPlateNumber = (plateNumber, categoryId) => {
    const plateNumberFormat = plateNumber.replace(/[-.]/g, '');
    // console.log('------- bks : === ', plateNumberFormat);
    if (categoryId && categoryId === MOTOR_TYPE) {
      return plateNumberFormat.slice(0, 4) + '-' + plateNumberFormat.slice(4);
    } else if (categoryId && categoryId === ELECTRICBIKE_TYPE) {
      return plateNumberFormat.slice(0, 5) + '-' + plateNumberFormat.slice(5);
    } else {
      return plateNumberFormat.slice(0, 3) + '-' + plateNumberFormat.slice(3);
    }
  }

  const getCategories = () => {
    return [
      { label: i18n.t(`account.categoryVehicle.fourSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'fourSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.sevenSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'sevenSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.nineSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'nineSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.sixteenSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'sixteenSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.twentyFourSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'twentyFourSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.twentyNineSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'twentyNineSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.thirtyFiveSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'thirtyFiveSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.fortyFiveSeaterCar`), value: { categoryId: CAR_TYPE, categoryName: 'fortyFiveSeaterCar' } },
      { label: i18n.t(`account.categoryVehicle.motorbike`), value: { categoryId: MOTOR_TYPE, categoryName: 'motorbike' } },
      { label: i18n.t(`account.categoryVehicle.electricBike`), value: { categoryId: ELECTRICBIKE_TYPE, categoryName: 'electricBike' } },
    ]
  }

  const getCategory = (categoryName) => {
    const categoriesFilter = categories.filter(category => category.value.categoryName === categoryName);
    return categoriesFilter[0]
  }

  const categories = useMemo(getCategories, []);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      vehicleName: currentData ? currentData.vehicle_name : '',
      plateNumber: currentData ? currentData.plate_number : '',
      category: currentData ? getCategory(currentData.category_name) : categories[0],
      vehicleLoad: currentData ? currentData.vehicle_load : '',
      defaultVehicle: currentData ? currentData.default : false
    },
  });

  const handleCancel = () => {
    handleOnCloseAddVehicle();
  }

  const handleCloseAlert = () => {
    if (isLoading) {
      setIsLoading(false);
    } else if (!isSave) {
      setIsSave(undefined);
    } else {
      handleOnCloseAddVehicle();
    }
  }

  const handleSave = (data) => {
    setData(data);
    setIsLoading(true);
  }

  const renderHeader = (insets) => (
    <View style={[
      styles.header,
      { paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left - Metrics.regular : 0 }
    ]}>
      <Text style={styles.headerText}>{i18n.t(`account.attributes.addVehicle`)}</Text>
      <TouchableOpacity
        style={styles.btnClose}
        onPress={handleOnCloseAddVehicle}
      >
        <Image style={[styles.iconLarge, styles.iconColor]} source={Images.boldClose} />
      </TouchableOpacity>
    </View>
  );
  const renderFooter = (insets) => (
    <View style={[
      styles.footer,
      {
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : Metrics.normal,
        paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.regular
      }
    ]}>
      <TouchableOpacity
        style={[styles.btnAction, styles.btnCancel]}
        onPress={handleCancel}
      >
        <Text style={styles.btnCancelText}>{i18n.t(`setting.attributes.cancel`)}</Text>
      </TouchableOpacity>
      <View style={styles.distanceView}></View>
      <TouchableOpacity
        onPress={handleSubmit(handleSave)}
        style={styles.btnAction}
      >
        <Text style={styles.btnSaveText}>{i18n.t(`setting.attributes.save`)}</Text>
      </TouchableOpacity>
    </View>
  )

  const plateNumberPattern = useMemo(() => /^[0-9]+[a-zA-Z0-9]*(?:[-]{0,1})[a-zA-Z0-9]*(?:[.]{0,1})[a-zA-Z0-9]*$/, []);

  const renderTextInput = (name, required, maxLength, isUpperCase) => (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? i18n.t(`account.alert.required`) : false,
        pattern: {
          value: name === 'plateNumber' ? plateNumberPattern : /^.*$/,
          message: i18n.t(`account.alert.parttern`),
        },
      }}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={styles.inputBox}>
          <View style={styles.lable}>
            <Text style={styles.lableText}>{i18n.t(`account.attributes.${name}`)}</Text>
            {required && <Text style={styles.required}>*</Text>}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={i18n.t(`account.attributes.contentEnter`)}
            placeholderTextColor={Colors.inputPlaceholder}
            onBlur={onBlur}
            onChangeText={(text) => {
              if (name === 'plateNumber') {
                const trimmedText = text.replace(/\s+/g, '');
                onChange(trimmedText);
              } else {
                onChange(text);
              }
            }}
            value={value}
            maxLength={maxLength}
            disableFullscreenUI={true}
          />
          {required && errors[name] && <Text style={styles.errorText}>{errors[name].message}</Text>}
        </View>
      )}
    />
  )


  const renderPicker = (name, required) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.inputBox}>
          <View style={styles.lable}>
            <Text style={styles.lableText}>{i18n.t(`account.attributes.${name}`)}</Text>
            {required && <Text style={styles.required}>*</Text>}
          </View>
          {/* <Dropdown
            style={styles.dropdown}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder={i18n.t(`account.attributes.selectCategory`)}
            placeholderStyle={[styles.textPicker, styles.placeholder]}
            search={false}
            containerStyle={styles.dropdownContainer}
            selectedTextStyle={styles.textPicker}
            renderItem={(item) => (
              <View style={styles.itemStyle}>
                <Text style={styles.textPicker}>{item.label}</Text>
              </View>
            )}
            value={value}
            onChange={onChange}

            renderRightIcon={() => (
              <Image
                source={Images.arrow_dow}
                style={{ width: 24, height: 24, tintColor: Colors.text }}
              />
            )}
          /> */}
          <DropdownElement
            value={value}
            data={categories}
            onChange={onChange}
          />
        </View>
      )}
    />
  );

  const renderSwitch = (name) => {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, onBlur } }) => (
          <View style={styles.switchBox}>
            <Text style={styles.switchLable}>{i18n.t(`account.attributes.${name}`)}</Text>
            <View
              style={!value && styles.switch}
            >
              <SwitchElement
                onValueChange={onChange}
                value={value}
                barWidth={Metrics.small * 5}
                barHeight={Metrics.icon}
                innerCircleSize={Metrics.regular}
              />
            </View>
          </View>
        )}
      />
    )
  };

  const renderAlert = (status) => {
    return (
      <AlertError
        title={i18n.t(`alert.attributes.${status ? 'success' : 'failed'}`)}
        body={!status ? i18n.t(`account.alert.${alertMessage}`) : undefined}
        handleClose={handleCloseAlert}
        iconSoucre={Images[status ? 'success' : 'fail']}
      />
    )
  }
  const renderLoadingAlert = () => {
    return (
      <AlertError
        body={i18n.t(`account.attributes.loading`)}
        handleClose={handleCloseAlert}
        isLoading={isLoading}
      />
    )
  }

  return (


    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <Animated.View
          style={[styles.addVehiclecontainer, { top: insets.top }]}
          entering={SlideInDown.springify().damping(18)}
          exiting={FadeOut}
        >
          {renderHeader(insets)}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView>
              <Pressable style={[
                styles.content,
                {
                  paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left : Metrics.regular
                }
              ]}>
                {renderTextInput('vehicleName', true, 20)}
                {renderTextInput('plateNumber', true, 12)}
                {renderPicker('category', true)}
                {renderTextInput('vehicleLoad', false, 20)}
                {renderSwitch('defaultVehicle')}
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
          {renderFooter(insets)}
          {isSave !== undefined && !isLoading && renderAlert(isSave)}
          {isLoading && renderLoadingAlert()}
        </Animated.View >
      )}
    </SafeAreaInsetsContext.Consumer >
  )

}

export default React.memo(AddVehicle);