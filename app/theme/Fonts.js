import { StyleSheet } from "react-native";

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  input: 18,
  large: 18,
  regular: 16,
  medium: 14,
  small: 12,
  tiny:10
};

export default StyleSheet.create({
  h1: {
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
  },
  h3: {
    fontSize: size.h3,
  },
  large: {
    fontSize: size.large,
  },
  normal: {
    fontSize: size.normal,
  },
  medium: {
    fontSize: size.medium,
  },
  regular: {
    fontSize: size.regular,
  },
  small: {
    fontSize: size.small,
  },
  tiny:{
    fontSize:size.tiny,
  }
});
