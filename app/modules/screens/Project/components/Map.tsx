import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);



const baseLat = 21.0285;
const baseLng = 105.8542;

export default function Map({ users, coordinates = [], data = {}, mapType = "https://raster.metaforce.vn/wmts/satellite_layer/webmercator/{z}/{x}/{y}.png" }) {
    const camera = useRef<MapLibreGL.Camera>(null);

    const [points, setPoints] = useState([])
    const [polygons, setPolygons] = useState([])
    const [lines, setLines] = useState([])

    // const generateFakeUsers = () => {
    //     const names = [
    //         'Dũng', 'Huyền', 'Oanh', 'Tùng', 'Trang',
    //         'Linh', 'Phong', 'Lan', 'Nam', 'Hà',
    //         'Tâm', 'Vy', 'Bình', 'Thảo', 'Quân',
    //         'Minh', 'Nga', 'Sơn', 'Mai', 'Anh',
    //         'Khoa', 'Yến', 'Hiếu', 'Loan', 'Tuấn'
    //     ];

    //     return names.map((name, index) => {
    //         const latOffset = (Math.random() - 0.5) * 0.03;
    //         const lngOffset = (Math.random() - 0.5) * 0.03;

    //         return {
    //             id: index + 1,
    //             longitude: baseLng + lngOffset,
    //             latitude: baseLat + latOffset,
    //             user: {
    //                 username: name,
    //                 role: index === 0 ? 'leader' : 'member',
    //                 status: Math.random() > 0.3 ? 1 : 0,
    //             }
    //         };
    //     });
    // };
    // const [users, setUsers] = useState(generateFakeUsers());

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // Cập nhật ngẫu nhiên vị trí của mỗi user quanh vị trí cũ
    //         setUsers((prevUsers) =>
    //             prevUsers.map(user => {
    //                 const newLat = user.latitude + (Math.random() - 0.5) * 0.001;
    //                 const newLng = user.longitude + (Math.random() - 0.5) * 0.001;

    //                 return {
    //                     ...user,
    //                     latitude: newLat,
    //                     longitude: newLng
    //                 };
    //             })
    //         );
    //         console.log(users)
    //     }, 3000);

    //     return () => clearInterval(interval); // clear khi unmount
    // }, []);
    // const randomNearbyCoord = ([lon, lat]: number[], delta = 0.005) => {
    //     const rand = () => (Math.random() - 0.5) * delta * 2;
    //     return [lon + rand(), lat + rand()];
    // }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setUsers((prevUsers) =>
    //             prevUsers.map((u) => {
    //                 const [lon, lat] = randomNearbyCoord([u.longitude, u.latitude], 0.0015);
    //                 return {
    //                     ...u,
    //                     longitude: lon,
    //                     latitude: lat,
    //                 };
    //             })
    //         );
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        if (data && data.project_details) {
            const geojsonList = data.project_details.map(((p) => JSON.parse(p.geojson)));
            const points = geojsonList.filter(f => f.geometry.type === 'Point');
            const lines = geojsonList.filter(f => f.geometry.type === 'LineString');
            const polygons = geojsonList.filter(f => f.geometry.type === 'Polygon');
            setPoints(points);
            setLines(lines);
            setPolygons(polygons);
        }
    }, [data])

    const getFeatureCollection = (features) => ({
        type: 'FeatureCollection',
        features: features,
    });

    return (
        <View style={styles.container} key={mapType}
        >
            <MapLibreGL.MapView
                compassEnabled={true}
                compassViewPosition={3}
                style={styles.map}
                mapStyle="https://tiles.metaforce.vn/styles/vietnam-admin/style.json"
                projection="globe"
            >
                <MapLibreGL.RasterSource
                    id="raster-source"
                    tileUrlTemplates={[
                        mapType,
                    ]}
                    maxZoomLevel={14}
                    tileSize={256}
                >
                    <MapLibreGL.RasterLayer
                        id="raster-layer"
                        sourceID="raster-source"
                        style={{ rasterOpacity: 1 }}
                    />
                </MapLibreGL.RasterSource>
                <MapLibreGL.ShapeSource id="points-source" shape={getFeatureCollection(points)}>
                    <MapLibreGL.CircleLayer
                        id="points-layer"
                        style={{
                            circleRadius: 6,
                            circleColor: '#0094ff',
                            circleStrokeWidth: 2,
                            circleStrokeColor: '#ffffff',
                        }}
                    />
                </MapLibreGL.ShapeSource>

                <MapLibreGL.ShapeSource id="lines-source" shape={getFeatureCollection(lines)}>
                    <MapLibreGL.LineLayer
                        id="lines-layer"
                        style={{
                            lineColor: '#0094ff',
                            lineWidth: 3,
                            lineOpacity: 0.8,
                            lineJoin: 'round',
                            lineCap: 'round',
                        }}
                    />
                </MapLibreGL.ShapeSource>

                <MapLibreGL.ShapeSource id="polygons-source" shape={getFeatureCollection(polygons)}>
                    <MapLibreGL.FillLayer
                        id="polygons-layer"
                        style={{
                            fillColor: 'rgba(10, 70, 235, 0.3)',
                            fillOutlineColor: '#0094ff',
                        }}
                    />
                </MapLibreGL.ShapeSource>
                <MapLibreGL.Camera
                    ref={camera}
                    // centerCoordinate={coordinates}
                    defaultSettings={{
                        centerCoordinate: data?.longitude && data?.latitude ? [data.longitude, data.latitude] : [105.85, 21.02],
                        zoomLevel: data && data?.zoom ? data.zoom : 11,
                        pitch: 0,
                        heading: 0
                    }}
                />
                {users.map((user, index) => (
                    <MapLibreGL.MarkerView
                        key={`user-${index}`}
                        id={`user-${index}`}
                        coordinate={[user.longitude, user.latitude]}
                    >
                        <View style={{ alignItems: 'center' }}>

                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: user.user.status === 1 ? 'green' : 'red',
                                    borderWidth: 2,
                                    borderColor: '#fff',
                                }}
                            />
                            <Text style={{
                                fontSize: 5, zIndex: 99, color: 'white', width: 20,
                                height: 20,
                                paddingTop: 4,
                                textAlign: 'center',
                                borderRadius: 10,
                                backgroundColor: user.user.status === 1 ? 'green' : 'red',
                                borderWidth: 2,
                                borderColor: '#fff',
                            }}>{user.user.username}</Text>
                        </View>
                    </MapLibreGL.MarkerView>
                ))}
            </MapLibreGL.MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    map: {
        flex: 1,
    },
    avatarWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    labelIcon: {
        fontSize: 10,
        marginBottom: 4,
    },
    statusDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    dropMarker: {
        width: 30,
        height: 40,
        backgroundColor: 'green',
        borderRadius: 15,
        transform: [{ rotate: '45deg' }],
        justifyContent: 'center',
        alignItems: 'center',
    }
});
