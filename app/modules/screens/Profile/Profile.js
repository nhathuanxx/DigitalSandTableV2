import React from "react";
import ProfileScreen from '@app/modules/views/profile/Profile'

export class Profile extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerShown: false
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    render() {
        return (
            <ProfileScreen navigation={this.props.navigation}
            />
        );
    }
}