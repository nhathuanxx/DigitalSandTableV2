import {
    Alert,
} from "react-native";
import { connect } from "react-redux";
import React, { forwardRef, useImperativeHandle, Fragment, useState, useRef, useEffect } from "react";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { useGetTraffic } from "@app/hooks/place_detail.hook";
import i18n from "@app/i18n/i18n";
import { getMapImagesInScreen } from '@app/libs/utils.js'


const TrafficLayer = forwardRef((props, ref) => {
    const [trafficArray, setTrafficArray] = useState([]);

    const useFetchGetTraffic = useGetTraffic();

    let previousXTopLeft = null;
    let previousYTopLeft = null;

    let previousXTopRight = null;
    let previousYTopRight = null;

    let previousXBottomLeft = null;
    let previousYBottomLeft = null;

    let previousXBottomRight = null;
    let previousYBottomRight = null;

    useImperativeHandle(ref, () => ({
        getLocation: async (z, topLeft, topRight, bottomLeft, bottomRight) => {
            // console.log(`topLeft: ${topLeft}; topRight: ${topRight}; bottomLeft: ${bottomLeft}; bottomRight: ${bottomRight}`)
            console.log('--------zoom-----------', Math.round(z))
            const imagesPoint = getMapImagesInScreen(z, topLeft, topRight, bottomLeft, bottomRight)
            const points = imagesPoint.points;

            // Kiểm tra nếu x hoặc y thay đổi quá over đơn vị so với giá trị trước đó
            let over = 0

            if (previousXTopLeft === null || previousYTopLeft === null || previousXTopRight === null || previousYTopRight === null || previousXBottomLeft === null || previousYBottomLeft === null || previousXBottomRight === null || previousYBottomRight === null ||
                Math.abs(imagesPoint.xTopLeft - previousXTopLeft) > over || Math.abs(imagesPoint.yTopLeft - previousYTopLeft) > over ||
                Math.abs(imagesPoint.xTopRight - previousXTopRight) > over || Math.abs(imagesPoint.yTopRight - previousYTopRight) > over ||
                Math.abs(imagesPoint.xBottomLeft - previousXBottomLeft) > over || Math.abs(imagesPoint.yBottomLeft - previousYBottomLeft) > over ||
                Math.abs(imagesPoint.xBottomRight - previousXBottomRight) > over || Math.abs(imagesPoint.yBottomRight - previousYBottomRight) > over
            ) {
                let responses = []
                // console.log(`x: ${x}, y: ${y}, z: ${z}`);

                previousXTopLeft = imagesPoint.xTopLeft;
                previousYTopLeft = imagesPoint.yTopLeft;

                previousXTopRight = imagesPoint.xTopRight;
                previousYTopRight = imagesPoint.yTopRight;

                previousXBottomLeft = imagesPoint.xBottomLeft;
                previousYBottomLeft = imagesPoint.yBottomLeft;

                previousXBottomRight = imagesPoint.xBottomRight;
                previousYBottomRight = imagesPoint.yBottomRight;
                for (let latLong of points) {
                    const response = await handleGetTraffic(latLong.x, latLong.y, Math.round(z));
                    if (response != null) {
                        responses.push(response)
                    }
                }
                if (responses.length > 0) {
                    const mergedFeatures = responses.map(item => item.features).reduce((acc, features) => acc.concat(features), []);
                    setTrafficArray(mergedFeatures)
                }
                // console.log("_____________trafficArray+++++++++++", mergedFeatures)
            }
        }
    }));


    const handleGetTraffic = async (x, y, z) => {
        // console.log(`-=-=-=-=-=-=--=-=-=-=-=-=x: ${x}, y: ${y}, z: ${z}`);

        const params = {
            x: x, y: y, z: z
        }
        try {
            const response = await useFetchGetTraffic.mutateAsync({ params });

            if (response.status > 300) {
                return null;
            } else {
                return response;
            }
        } catch (error) {
            Alert.alert(
                i18n.t("alert.attributes.warning"),
                error.message || i18n.t("alert.attributes.warning"),
                [
                    { text: i18n.t("alert.attributes.oke") },
                ]
            );
            return null;
        }
    };

    const getColor = (level) => {
        if (level == constants.TRAFFIC_JAM) {
            return Colors.trafficJam
        } else if (level == constants.TRAFFIC_EAST_ROAD) {
            return Colors.trafficEastRoad
        } else if (level == constants.TRAFFIC_HIGH) {
            return Colors.trafficHigh
        } else if (level == constants.TRAFFIC_NORMAL) {
            return Colors.trafficNormal
        }
    }
    return (
        <>
            {trafficArray && trafficArray.map((item, index) => (
                <MapLibreGL.ShapeSource key={index} id={`${index}_route`} shape={item}>
                    <MapLibreGL.LineLayer
                        id={`${index}_route_line`}
                        style={{
                            lineJoin: 'round',
                            lineCap: 'round',
                            lineColor: getColor(item.properties.level),
                            lineWidth: 3,
                        }}
                    />
                </MapLibreGL.ShapeSource>
            ))}
        </>
    )
})

function mapStateToProps(state) {
    return {

    };
}
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(TrafficLayer);
