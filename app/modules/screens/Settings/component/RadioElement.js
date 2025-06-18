import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Metrics } from "@app/theme";
import i18n from "@app/i18n/i18n";
import storage from "@app/libs/storage";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import createStyles from "./styles";

const RadioElement = ({ data, fieldName, selectedId, handleOnValueChange }) => {

  const { isDarkTheme } = useTheme();
  const styles = createStyles(isDarkTheme);

  const [optionId, setOptionId] = useState(selectedId);

  useEffect(() => {
    setOptionId(selectedId);
  }, [selectedId]);

  const onSelect = (id) => {
    setOptionId(id);
    handleOnValueChange(fieldName, id);
  };

  const renderRadioOption = (item, index) => (
    <TouchableOpacity style={styles.radioOption} key={item.id} onPress={() => onSelect(item.id)}>
      <View style={[
        styles.cirleRadioButton,
        { borderColor: item.color }
      ]}>
        {item.id === selectedId &&
          <View
            style={[
              styles.cirleRadioButtonIn,
              { backgroundColor: item.color }
            ]}
          />
        }
      </View>
      <View style={styles.radioLabelView}>
        <Text style={[
          styles.radioLabelText,
          { color: item.color }
        ]}>
          {item.label}
        </Text>
      </View>
    </TouchableOpacity >
  )

  return (
    <View style={styles.settingElement}>
      <View style={styles.titleElement}>
        <Text style={styles.title}>{i18n.t(`setting.attributes.${fieldName}`)}</Text>
      </View>
      <View style={styles.selectArea}>
        {data.map((item, index) => (
          renderRadioOption(item, index)
        ))}
      </View>
    </View>
  )

}

export default React.memo(RadioElement);