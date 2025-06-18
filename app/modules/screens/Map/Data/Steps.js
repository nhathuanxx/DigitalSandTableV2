import { connect } from "react-redux";
import React, { Fragment, useState, useRef, useEffect, useMemo } from "react";
import MapLibreGL from "@maplibre/maplibre-react-native";
import Marker from "../Marker/Marker";

const Steps = (props) => {
    const stepsLocation = useMemo(() => {
        if (props.routeResult != null) {
            const allSteps = props.routeResult[0].legs.reduce((accumulator, currentValue) => {
                return accumulator.concat(currentValue.steps);
            }, []); // Cung cấp mảng rỗng [] làm giá trị khởi tạo cho reduce

            if (allSteps.length > 0) {
                const endLocations = allSteps.map(step => [step.end_location.lng, step.end_location.lat]);
                return endLocations;
            } else {
                return null;
            }
        }
    }, [props.routeResult]);

    useEffect(() => {
        if (props.camera.current && props.stepView != null) {
            props.camera.current.setCamera({
                animationMode: "linear",
                animationDuration: 1000,
                // sửa lại để kéo map theo marker
                centerCoordinate: props.stepView.location,
                zoomLevel: 17,
            });
        }
    }, [props.stepView])

    return (
        <>
            {stepsLocation &&
                stepsLocation.map((item, index) => (
                    <MapLibreGL.PointAnnotation
                        key={`step_${index}`}
                        id={`pointSteps_${index}`}
                        coordinate={item}
                    >
                        <Marker type={'step'} />
                    </MapLibreGL.PointAnnotation>
                ))
            }
        </>
    )
}

function mapStateToProps(state) {
    return {
        routeResult: state.app.routeResult,
        stepView: state.app.stepView,
    };
}
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Steps);
