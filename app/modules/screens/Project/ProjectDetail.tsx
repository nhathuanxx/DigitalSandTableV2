import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView,
  Dimensions,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Map from '@app/modules/screens/Project/Map';
import Map from '@app/modules/screens/Project/components/Map';

import dayjs from "dayjs"
import { useGlobal } from '@app/modules/context/GlobalContext';
import { binaryStringToBase64 } from '@app/modules/common/util'
// import RNFS from 'react-native-fs';
// import FileViewer from 'react-native-file-viewer';
// import {
//   Toast
// } from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TreeView from './TreeView';
import {
  usePushDataUser, useGetListUserData, useGetProjectDetail, useDownloadFile
} from "@app/hooks/projectHook";

import ProjectDetailStyles from "./ProjectDetailStyles"

export default function ProjectDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { project, mapTypes } = route.params as { project: any, mapTypes: any };
  const [users, setUsers] = useState([]);
  const { width, height } = Dimensions.get('window');
  const modalHeight = height * 0.8;
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMapTypes, setShowMapTypes] = useState(false);
  const [showTree, setShowTree] = useState(false);

  const [mapType, setMapType] = useState("https://raster.metaforce.vn/wmts/satellite_layer/webmercator/{z}/{x}/{y}.png");
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [userSelected, setUserSelected] = useState(null)

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);
  const toggleMapTypes = () => setShowMapTypes(!showMapTypes);
  const closeMapTypes = () => setShowMapTypes(false);
  const toggleTree = () => setShowTree(!showTree);
  const closeTree = () => setShowTree(false);
  const { location, deviceId } = useGlobal();
  const pushDataUser = usePushDataUser();
  useEffect(() => {
    if (location) {
      console.log('Vị trí hiện tại:', location.latitude, location.longitude);
    }
    if (deviceId) {
      console.log('Device ID:', deviceId);
    }
  }, [location, deviceId]);
  const { data: dataDetail, refetch: refetchDataDetail } = useGetProjectDetail({ id: project.id }, {
    retry: 1,
    enabled: project.id ? true : false,
  });
  const { data: dataMember, refetch: refetchDataMember, refetch } = useGetListUserData({ id: project.id }, {
    retry: 1,
    enabled: project.id ? true : false,
    refetchInterval: 3000
  });
  useEffect(() => {
    const newData = dataMember?.data;
    if (newData && newData.length > 0) {
      if (!userSelected) {
        setCoordinates([newData[0].longitude, newData[0].latitude])
      }
      setUsers(newData)
    }
    else {
      setUsers([])
    }
  }, [dataMember])

  useEffect(() => {
    console.log('dataDetail 123123', dataDetail)
  }, [dataDetail])

  const handlePushDataUser = async () => {
    if (!deviceId || !location) {
      console.log('Thiếu deviceId hoặc location, không gửi dữ liệu');
      return;
    }
    const payload: any = {
      device_id: deviceId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: dayjs(),
      project_id: project.id,
    };
    try {
      const result = await pushDataUser.mutateAsync(payload);
    } catch (error) {
      console.log('Lỗi gửi dữ liệu:', error);
    }
  };

  useEffect(() => {
    if (deviceId && location) {
      const interval = setInterval(() => {
        handlePushDataUser();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [deviceId, location]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMapPress = () => {
    console.log('Map pressed');
  };

  const handleZoom = () => {
    console.log('zoom')
  }

  const onCloseDetail = () => {
    setVisibleDetail(false)
  }
  const ItemDetail = ({ label, value }: { label: string; value: string }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: '600', color: '#444' }}>{label}:</Text>
      <Text style={{ color: '#666', marginTop: 2 }}>{value || '---'}</Text>
    </View>
  );
  // const saveAndOpenFile = async (binaryString: string, file_name: string) => {
  //   try {
  //     const base64Data = binaryStringToBase64(binaryString);
  //     const path: any = `${RNFS.DownloadDirectoryPath}/${file_name}`;

  //     await RNFS.writeFile(path, base64Data, 'base64');
  //     console.log('✅ File saved to:', path);

  //     try {
  //       await FileViewer.open(path, {
  //         showOpenWithDialog: true,
  //       });
  //     } catch (openErr) {
  //       Toast.success('Tải file thành công');
  //     }

  //   } catch (err: any) {
  //     Toast.fail('❌ Lỗi khi lưu hoặc mở file:', err);
  //   }
  // };
  // const download = useDownloadFile();
  // const downloadFile = async (file: string) => {
  //   try {
  //     const result = await download.mutateAsync(file.file_id);
  //     saveAndOpenFile(result, file.file_name);
  //   } catch (error) {
  //     console.log('Lỗi download file:', error);
  //   }
  // }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: 'rgba(59, 91, 22, 0.9)' }}>
      <TouchableWithoutFeedback onPress={() => {
        closeDropdown();
        closeMapTypes();
        closeTree();
      }}>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={ProjectDetailStyles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Icon name="arrow-left" size={16} color="#333" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={ProjectDetailStyles.projectName} numberOfLines={2} ellipsizeMode="tail">
                {project.name}
              </Text>
              <Text style={ProjectDetailStyles.projectDate} numberOfLines={2} ellipsizeMode="tail">
                {`(${project.from_date} - ${project.to_date})`}
              </Text>
            </View>
            <TouchableOpacity style={{ padding: 4 }} onPress={() => setVisibleDetail(true)} >
              <Icon name="file-search" size={16} color="black" />
            </TouchableOpacity>
          </View>

          <View style={ProjectDetailStyles.container}>
            <View style={ProjectDetailStyles.actionList}>
              {/* <TouchableOpacity style={ProjectDetailStyles.actionButton} onPress={() => {
                setVisibleDetail(true)
                closeMapTypes();
                closeDropdown();
              }} >
                <Icon name="file-search" size={16} color="black" />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => {
                toggleDropdown();
                closeMapTypes();
                closeTree();
              }} style={ProjectDetailStyles.actionButton}>
                <Icon name="account-group" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                toggleMapTypes();
                closeDropdown();
                closeTree();
              }} style={ProjectDetailStyles.actionButton}>
                <Icon name="table" size={20} color="black" />
              </TouchableOpacity>

              <TouchableOpacity style={ProjectDetailStyles.actionButton} onPress={() => {
                toggleTree();
                closeMapTypes();
                closeDropdown();
              }} >
                <Icon name="sitemap" size={16} color="black" />
              </TouchableOpacity>

              {/* {showTree && (
                <View style={{ ...ProjectDetailStyles.memberDropdown, top: 88 }}>
                  {dataDetail?.data?.project_groups && dataDetail?.data?.project_details ? <TreeView
                    projectGroups={dataDetail?.data?.project_groups}
                    projectDetails={dataDetail?.data?.project_details}
                  /> : (
                    <View style={{ padding: 10, alignItems: 'center' }}>
                      <Text style={{ color: '#999' }}>Empty</Text>
                    </View>
                  )}
                </View>
              )} */}

              {showDropdown && (
                <View style={ProjectDetailStyles.memberDropdown}>
                  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 240 }}>
                    {users.length > 0 ?
                      users.map(item => (
                        <TouchableOpacity
                          key={item.device_id}
                          style={ProjectDetailStyles.memberItem}
                          onPress={() => {
                            setUserSelected(item);
                            setCoordinates([item.longitude, item.latitude]);
                            setShowDropdown(false);
                          }}
                        >
                          <Text style={ProjectDetailStyles.memberName}>{item?.user?.full_name}</Text>
                          <Text style={ProjectDetailStyles.memberInfo}>{item?.user?.username} | {item.rank}</Text>
                        </TouchableOpacity>
                      ))
                      : (
                        <View style={{ padding: 10, alignItems: 'center' }}>
                          <Text style={{ color: '#999' }}>Empty</Text>
                        </View>
                      )}
                  </ScrollView>
                </View>
              )}

              {showMapTypes && (
                <View style={{ ...ProjectDetailStyles.memberDropdown, top: 44 }}>
                  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 240 }}>
                    {mapTypes && mapTypes.length > 0 ?
                      mapTypes.map(item => (
                        <TouchableOpacity
                          key={item.value}
                          style={ProjectDetailStyles.memberItem}
                          onPress={() => {
                            setMapType(item.value);
                            closeMapTypes();
                          }}
                        >
                          <Text style={ProjectDetailStyles.memberName}>{item?.note}</Text>
                        </TouchableOpacity>
                      ))
                      : (
                        <View style={{ padding: 10, alignItems: 'center' }}>
                          <Text style={{ color: '#999' }}>Empty</Text>
                        </View>
                      )}
                  </ScrollView>
                </View>
              )}
            </View>
            <Map users={users} coordinates={coordinates} data={dataDetail?.data} mapType={mapType} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal
      visible={visibleDetail}
      transparent
      animationType="fade"
      onRequestClose={onCloseDetail}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: width * 0.5,
            maxHeight: modalHeight,
            backgroundColor: 'white',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
              {project.name}
            </Text>
            <TouchableOpacity
              onPress={onCloseDetail}
              style={{
                borderRadius: 16,
                padding: 6,
                position: 'absolute',
                right: 0,
              }}
            >
              <Icon name={"close"} size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView>
            <ItemDetail label="Mã dự án" value={project.code} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={{ fontWeight: '600' }}>Từ ngày:</Text>
                <Text style={{ color: '#666', marginTop: 2 }}>{project.from_date}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={{ fontWeight: '600' }}>Đến ngày:</Text>
                <Text style={{ color: '#666', marginTop: 2 }}>{project.to_date}</Text>
              </View>
            </View>
            <ItemDetail label="Mô tả" value={project.description} />
            <View style={{ flex: 1, marginBottom: 8 }}>
              <Text style={{ fontWeight: '600', marginBottom: 4 }}>Tệp đính kèm:</Text>
              {
                dataDetail?.data?.files?.length > 0 ? (
                  dataDetail.data.files.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (item.file_id) {
                          downloadFile(item);
                        }
                      }}
                    >
                      <Text style={{ color: '#007BFF', marginVertical: 2 }}>
                        📎 {item.file_name}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: '#999' }}>Không có tệp đính kèm</Text>
                )
              }
            </View>
            <ItemDetail label="Tạo bởi" value={`${project.created_by} (${project.created_at_str})`} />
            <ItemDetail label="Cập nhật" value={`${project.updated_by} (${project.updated_at_str})`} />
          </ScrollView>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <TouchableOpacity
              onPress={onCloseDetail}
              style={{
                flex: 1,
                backgroundColor: '#007AFF',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

     <Modal
      visible={showTree}
      transparent
      animationType="fade"
      onRequestClose={closeTree}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: width * 0.5,
            maxHeight: modalHeight,
            backgroundColor: 'white',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
              {project.name}
            </Text>
            <TouchableOpacity
              onPress={closeTree}
              style={{
                borderRadius: 16,
                padding: 6,
                position: 'absolute',
                right: 0,
              }}
            >
              <Icon name="close" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* TreeView content */}
          <ScrollView>
            <TreeView
              projectGroups={dataDetail?.data?.project_groups}
              projectDetails={dataDetail?.data?.project_details}
              onTreeBuilt={({ tree, levelMax }) => {
                console.log('TREE:', tree);
                console.log('LEVEL MAX:', levelMax);
              }}
            />
          </ScrollView>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <TouchableOpacity
              onPress={closeTree}
              style={{
                flex: 1,
                backgroundColor: '#007AFF',
                paddingVertical: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}


