// import React, { Component } from "react";
// import {
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Colors, Images } from "@app/theme";

// import { Input } from "react-native-elements";
// import Logo from "@app/modules/views/login/Logo";
// import ButtonRegister from "@app/modules/views/register/ButtonRegister";

// const { height } = Dimensions.get("window");
// export class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isShowPassword: false,
//       isShowPConfirmPassword: false,
//       registerBody: {
//         domainCode: "",
//         email: "",
//         username: "",
//         password: "",
//         password_confirmation: "",
//         role: "driver",
//       },
//       errorMessage: [],
//     };
//   }
//   _goToLogin = () => {
//     this.props.navigation.navigate("LoginForm");
//   };

//   //   ----------------------------

//   renderRegisterForm() {
//     return (
//       <View style={{ height: height / 1.5 }}>
//         <Logo />
//         <Text style={selfStyle.txtRegister}>Đăng ký</Text>
//         <KeyboardAvoidingView
//           behavior={Platform.OS == "ios" ? "padding" : "height"}
//           style={selfStyle.inputContainer}
//         >
//           <Input
//             containerStyle={selfStyle.infoBlock}
//             placeholder="Email"
//             onChangeText={(value) => {
//               this.setState({
//                 registerBody: { ...this.state.registerBody, email: value },
//               });
//             }}
//             errorMessage={
//               this.state.errorMessage.filter((e) => e.fieldName === "email")[0]
//                 ?.errorMessage
//             }
//           />
//           <Input
//             containerStyle={selfStyle.infoBlock}
//             placeholder="Tên đăng nhập"
//             onChangeText={(value) => {
//               this.setState({
//                 registerBody: { ...this.state.registerBody, username: value },
//               });
//             }}
//             errorMessage={
//               this.state.errorMessage.filter(
//                 (e) => e.fieldName === "username",
//               )[0]?.errorMessage
//             }
//           />
//           <Input
//             secureTextEntry={!this.state.isShowPassword}
//             containerStyle={selfStyle.infoBlock}
//             placeholder="Mật khẩu"
//             onChangeText={(value) => {
//               this.setState({
//                 registerBody: { ...this.state.registerBody, password: value },
//               });
//             }}
//             errorMessage={
//               this.state.errorMessage.filter(
//                 (e) => e.fieldName === "password",
//               )[0]?.errorMessage
//             }
//             rightIcon={
//               <TouchableOpacity
//                 onPress={() => {
//                   this.setState({
//                     isShowPassword: !this.state.isShowPassword,
//                   });
//                 }}
//               >
//                 <Image
//                   source={
//                     !this.state.isShowPassword ? Images.eyeImg : Images.eyeHide
//                   }
//                   style={selfStyle.inlineImgRight}
//                 />
//               </TouchableOpacity>
//             }
//           />
//           <Input
//             secureTextEntry={!this.state.isShowConfirmPassword}
//             containerStyle={selfStyle.infoBlock}
//             placeholder="Nhập lại mật khẩu"
//             onChangeText={(value) => {
//               this.setState({
//                 registerBody: {
//                   ...this.state.registerBody,
//                   password_confirmation: value,
//                 },
//               });
//             }}
//             errorMessage={
//               this.state.errorMessage.filter(
//                 (e) => e.fieldName === "password_confirmation",
//               )[0]?.errorMessage
//             }
//             rightIcon={
//               <TouchableOpacity
//                 onPress={() => {
//                   this.setState({
//                     isShowConfirmPassword: !this.state.isShowConfirmPassword,
//                   });
//                 }}
//               >
//                 <Image
//                   source={!this.state.isShowConfirmPassword ? eyeImg : eyeHide}
//                   style={selfStyle.inlineImgRight}
//                 />
//               </TouchableOpacity>
//             }
//           />
//         </KeyboardAvoidingView>
//       </View>
//     );
//   }
//   renderRegisterButton() {
//     return (
//       <>
//         <ButtonRegister
//           navigation={this.props.navigation}
//           onRef={(child) => {
//             this.child = child;
//           }}
//           onError={(errorMessage) => {
//             this.setState({ errorMessage: errorMessage });
//           }}
//           registerBody={this.state.registerBody}
//         />
//         <View style={selfStyle.registerTextContainer}>
//           <Text>Đã có tài khoản, </Text>
//           <TouchableOpacity>
//             <Text
//               style={{ color: Colors.primary }}
//               onPress={() => this._goToLogin()}
//             >
//               Đăng nhập ngay
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </>
//     );
//   }
//   render() {
//     return (
//       <View style={selfStyle.container}>
//         <View style={{ backgroundColor: "white" }}>
//           {this.renderRegisterForm()}
//           {this.renderRegisterButton()}
//         </View>
//       </View>
//     );
//   }
// }
// const selfStyle = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   txtRegister: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   form: {
//     padding: 8,
//   },
//   registerTextContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     paddingVertical: 8,
//   },
//   inputContainer: {
//     padding: 8,
//     flex: 2,
//     alignItems: "center",
//   },
//   infoBlock: {
//     padding: 0,
//     backgroundColor: "white",
//     margin: 8,
//   },
//   inlineImgRight: {
//     width: 22,
//     height: 22,
//     tintColor: "rgba(0,0,0,0.5)",
//   },
// });
