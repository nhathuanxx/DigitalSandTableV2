import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  ScrollView,
  Platform
} from "react-native";
import { Images, Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { SlideInUp, SlideInDown, SlideOutDown, FadeIn, FadeOut, SlideInLeft } from "react-native-reanimated";
import storage from "@app/libs/storage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from './styles';
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

// const settings = ['mapDisplay', 'warning', 'system', 'gpsStatus', 'language'];
const settings = ['warning', 'system', 'language'];
const languages = ['vi', 'en', 'my'];


const SettingsBox = ({ isOpenSettings, handleCloseSettings }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);

  const navigation = useNavigation();
  // i18n.locale = 'en';
  // const [isOpen, setIsOpen] = useState(isOpenSettings);
  const [isChangeLanguage, setIsChangeLanguage] = useState(false);
  const [language, setLanguage] = useState('vi');

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const getLanguage = async () => {
    const language = await storage.get("language");
    return language ? language : 'vi'
  };

  useEffect(() => {
    const fetchLanguage = async () => {
      const lang = await getLanguage();
      setLanguage(lang);
    };
    fetchLanguage();
  }, []);

  const onCloseSettings = () => {
    if (isChangeLanguage) {
      setIsChangeLanguage(false);
    } else {
      handleCloseSettings();
    }
  };

  const onSelectOption = (name) => {
    switch (name) {
      case 'language':
        setIsChangeLanguage(true);
        break;
      case 'mapDisplay':
        navigation.navigate('MapDisplaySetting');
        break;
      case 'warning':
        navigation.navigate('WarningSetting');
        break;
      case 'system':
        navigation.navigate('SystemSetting');
        break;
    }
  }

  const onChangeLanguage = (languageName) => {
    storage.set('language', languageName);
    setLanguage(languageName);
    i18n.locale = languageName;
  }


  const renderSettingOptions = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>{i18n.t(`setting.name`)}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View>
          {settings.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => onSelectOption(option)}
            >
              <View>
                <Image style={[styles.icMedium, styles.optionIcon]}
                  source={Images[option]}
                />
              </View>
              <Text style={styles.optionText}>{i18n.t(`setting.attributes.${option}`)}</Text>
              <View>
                {option == 'language' ? (
                  <Image style={styles.icMedium}
                    source={Images[language]}
                    resizeMode='contain'
                  />
                ) : (
                  <Image style={styles.optionIconRight}
                    source={Images.arrowRight}
                    resizeMode='contain'
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

    </>
  );

  const renderLanguageItem = (item) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => onChangeLanguage(item)}
    >
      <View>
        <Image style={[styles.icMedium]}
          source={Images[item]}
        />
      </View>
      <Text style={styles.optionText}>{i18n.t(`setting.language.${item}`)}</Text>
      <View>
        <Image style={styles.optionIconRight}
          source={Images.arrowRight}
          resizeMode='contain'
        />
      </View>
    </TouchableOpacity>

  );

  const renderLanguageOptions = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>{i18n.t(`setting.language.name`)}</Text>
      </View>
      <View style={styles.content}>

        <Text style={styles.titleContent}>{i18n.t(`setting.language.recent`)}</Text>
        <TouchableOpacity
          style={styles.option}
        >
          <View>
            <Image style={[styles.icMedium]}
              source={Images[language]}
            />
          </View>
          <Text style={styles.optionText}>{i18n.t(`setting.language.${language}`)}</Text>
        </TouchableOpacity>

        <Text style={styles.titleContent}>{i18n.t(`setting.language.allLanguage`)}</Text>
        {/* <FlatList
          data={languages}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderLanguageItem(item)}
        /> */}
        <ScrollView style={{ flex: 1 }}>
          <View>
            {languages.map((option, index) => (
              renderLanguageItem(option)
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  )


  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={[styles.containerSettingBox, { paddingBottom: (insets.bottom + Metrics.small) }]}>
          <AnimatedPressable
            style={styles.backdrop}
            onPress={onCloseSettings}
            entering={FadeIn.duration(300)}
            exiting={FadeOut}
          />
          {isChangeLanguage ?
            (
              <Animated.View
                style={[
                  styles.bottomSheetSettings,
                  {
                    height: isPortrait ? dimensions.height * 0.45 : dimensions.height * 0.7,
                    paddingHorizontal: (!isPortrait && Platform.OS === 'ios') ? insets.left - Metrics.medium : 0
                  }
                ]}
                entering={SlideInLeft}
                exiting={SlideOutDown}
              >
                {renderLanguageOptions()}
              </Animated.View>
            )
            : (
              <Animated.View
                style={[
                  styles.bottomSheetSettings,
                  {
                    height: isPortrait ? dimensions.height * 0.45 : dimensions.height * 0.65,
                  }
                ]}
                entering={SlideInDown.springify().damping(20)}
                exiting={SlideOutDown}
              >
                {renderSettingOptions()}
              </Animated.View>
            )
          }
        </View>

      )}
    </SafeAreaInsetsContext.Consumer >

  );

};


export default React.memo(SettingsBox);