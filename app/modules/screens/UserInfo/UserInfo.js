import React from "react";
import UserInfoPage from '@app/modules/views/userinfo/Userinfo'

export class UserInfo extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return ( <
            UserInfoPage navigation = { this.props.navigation }
            />
        );
    }
}