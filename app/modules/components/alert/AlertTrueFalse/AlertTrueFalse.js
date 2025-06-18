import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    FlatList
} from "react-native";
import { Images } from "@app/theme";
import createStyles from "./styles";
import i18n from "@app/i18n/i18n";
import { useTheme } from "@app/modules/components/context/ThemeContext";
import { connect } from "react-redux";

const AlertTrueFalse = ({ title, body, handleClose, handleAccept }) => {
    const { isDarkTheme } = useTheme();
    const styles = createStyles(isDarkTheme);
    return (
        <Pressable
            style={styles.container}
            onPress={handleClose}
        >
            <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
                <View style={styles.body}>
                    <Image source={Images.question} style={styles.image} />
                    <View style={styles.bodyRight}>
                        <Text style={styles.text}>{title}</Text>
                        <Text style={styles.textBody}>{body}</Text>
                    </View>

                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleClose} style={[styles.button, styles.buttonWhite]}>
                        <Text style={styles.textBlue}>{i18n.t("route.attributes.cancel")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAccept} style={[styles.button, styles.buttonBlue]}>
                        <Text style={styles.textWhite}>{i18n.t("route.attributes.agree")}</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    );

};


function mapStateToProps(state) {
    return {
        showScreen: state.app.showScreen,
        typeRouteInput: state.app.typeRouteInput,
        navigationFrom: state.app.navigationFrom,
        navigationTo: state.app.navigationTo,
        vehicle: state.app.vehicle,
        route: state.app.route,
    };
}
const mapDispatchToProps = (dispatch) => ({
    updateShowScreen: (show) => dispatch(appAction.showScreen(show)),
    updateTypeRouteInput: (type) => dispatch(appAction.typeRouteInput(type)),
    updateNavigationFrom: (from) => dispatch(appAction.navigationFrom(from)),
    updateNavigationTo: (to) => dispatch(appAction.navigationTo(to)),
    handleTextInputFrom: (address) => dispatch(appAction.handleTextInputFrom(address)), // Thêm vào đây
    handleTextInputTo: (address) => dispatch(appAction.handleTextInputTo(address)), // Thêm vào đây
    updateVehicle: (vehicle) => dispatch(appAction.vehicle(vehicle)),
    updatePlace: (place) => dispatch(appAction.place(place)),
    updateMyLocation: (myLocation) => dispatch(appAction.myLocation(myLocation)),
    updateMapView: (mapView) => dispatch(appAction.mapView(mapView)),
    updateRouteResult: (routeResult) => dispatch(appAction.routeResult(routeResult)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AlertTrueFalse);
