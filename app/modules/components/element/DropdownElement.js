import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Metrics, Images, Colors as Themes } from "@app/theme";
import i18n from "@app/i18n/i18n";
import storage from "@app/libs/storage";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useOrientation } from "@app/modules/components/context/OrientationContext";

const DropdownElement = ({ data, value, onChange, placeholder }) => {

  const { isDarkTheme } = useTheme();
  const { isPortrait, dimensions } = useOrientation();
  const styles = createStyles(isDarkTheme, dimensions.width, dimensions.height);
  const Colors = Themes[isDarkTheme ? 'darkMode' : 'lightMode'];

  const [isToggle, setIsToggle] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });
  // const [isPressed, setIsPressed] = useState(false);
  const [pressedId, setPressedId] = useState(undefined);
  const [itemSelected, setItemSelected] = useState(value);


  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dropdownRef.current && isToggle) {
      dropdownRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          x: px,
          y: py + height / 2,
          width: width,
        });
      });
    }
  }, [isToggle]);

  const onSelect = (item) => {
    setItemSelected(item);
    onChange(item);
    setIsToggle(false)
  }


  return (
    <View style={styles.dropdownElement}>
      <View style={styles.seclectedView} ref={dropdownRef}>
        <Text
          numberOfLines={1}
          style={[
            styles.selectionText,
            { color: itemSelected ? Colors.text : Colors.inputPlaceholder }
          ]}>
          {itemSelected ? itemSelected.label : placeholder}
        </Text>
        <TouchableOpacity
          style={styles.rightBtn}
          onPress={() => {
            setIsToggle(prev => !prev);
          }}
        >
          <Image
            source={Images.ic_whiteArrow}
            style={[
              styles.iconRightSelection,
              { transform: [{ scaleY: isToggle ? -1 : 1 }] }
            ]}
          />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={isToggle}
        animationType="fade"
        onRequestClose={() => setIsToggle(prev => !prev)}>
        <TouchableWithoutFeedback onPress={() => setIsToggle(prev => !prev)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.optionList,
                {
                  top: position.y,
                  left: position.x,
                  width: position.width,
                  // borderWidth: 1
                },
              ]}>
              <ScrollView>
                <View>
                  {data.map((item, index) => (
                    <Pressable
                      onPressIn={() => { setPressedId(index) }}
                      onPressOut={() => { setPressedId(undefined) }}
                      style={[
                        styles.optionBtn,
                        { backgroundColor: index === pressedId ? Colors.background : null }
                      ]}
                      onPress={() => onSelect(item)}
                    >
                      <Text style={styles.optionLabel}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  )

}

export default React.memo(DropdownElement);