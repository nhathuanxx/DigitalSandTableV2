import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Images } from "@app/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import i18n from "@app/i18n/i18n";
import Header from "../Header";
import { fetchProvinces } from "@app/libs/CameraAxios";
import createStyles from "./styles";
import { useTheme } from "@app/modules/components/context/ThemeContext";

const Province = ({ }) => {
  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);
  const navigation = useNavigation();
  const route = useRoute();
  const { title } = route.params;

  const [provinces, setProvinces] = useState([]);

  const getProvinces = async (newController) => {
    try {
      // let response = [];
      // // const newDistricts = new Set(districts);
      const response = await fetchProvinces(newController);
      if (response) {
        const provinceActive = response.filter(item => item.active === 1);
        setProvinces(provinceActive);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    const newController = new AbortController();
    getProvinces(newController);
    // console.log('caemera ==================== ', cameraLocation);
    return () => {
      newController.abort();
    };
  }, []);

  const renderHeader = () => (
    <Header name={title} prevScreen={'Account'} />
  )

  const renderList = () => (
    <ScrollView style={styles.provinceList}>
      {provinces.map((item, index) => (
        <TouchableOpacity style={styles.provinceItem}
          key={index}
          onPress={() => navigation.navigate('ProvinceCamera', { province: item })}
        >
          <Image source={Images.video} style={styles.iconVideo} />
          <Text style={styles.provinceText}>{i18n.t(`account.camera.${item.name}`)}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.footerScroll}></View>
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        {renderList()}

      </View>
    </View>
  )

}

export default Province;