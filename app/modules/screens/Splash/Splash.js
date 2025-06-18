import React from "react";
import Wallpaper from "@app/modules/views/login/Wallpaper";

import bgSrc from "@app/assets/images/splash.gif";

export class Splash extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  render() {
    return <Wallpaper bgSource={bgSrc}>{/* <Logo/> */}</Wallpaper>;
  }
}
