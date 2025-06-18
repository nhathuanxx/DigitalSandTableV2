import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  RefreshControl,
  TouchableWithoutFeedback
} from 'react-native';
import {
  useGetList,
  useGetMapTypes
} from "@app/hooks/projectHook";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from "dayjs";
import i18n from "@app/i18n/i18n";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toDataURL, normalize } from "@app/modules/common/util";
import { useAuth } from '@app/modules/context/AuthContext';
// import thumbnail from '@assets/image/thumbnail_demo.jpg'
import ProjectStyles from './ProjectStyles';
import { Images } from "@app/theme";

export default function Project() {
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [keyword, setKeyword] = useState('');

  const avatarInitial = useMemo(() => {
    return user && user.full_name ? user.full_name.charAt(0).toUpperCase() : null;
  }, [user])

  const convertTimeString = (time: string) => {
    const now = dayjs();
    const past = dayjs(time);
    const diff_seconds = now.diff(past, "second");

    if (diff_seconds < 60) return i18n.t("common.locales.just_now");

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff_seconds / unit.seconds);
      if (value >= 1) {
        const key = value > 1 ? `${unit.name}s` : unit.name;
        return `${value} ${i18n.t(`common.locales.${key}`)}`;
      }
    }

    return i18n.t("common.locales.just_now");
  };
  const { data: mapTypeData } = useGetMapTypes({
    retry: 1,
    staleTime: Infinity
  });
  const { data, refetch, isLoading } = useGetList({
    retry: 1,
    staleTime: Infinity
  });
  useEffect(() => { console.log('mapTypeData', mapTypeData) }, [mapTypeData])
  useEffect(() => {
    const newData = data?.data?.content;
    if (newData && newData.length > 0) {
      newData.forEach((p) => {
        p.created_at_str = convertTimeString(p.created_at);
        p.updated_at_str = convertTimeString(p.updated_at);
        p.from_date = dayjs(p.from_date).format('DD/MM/YYYY');
        p.to_date = dayjs(p.to_date).format('DD/MM/YYYY');
        if (p.thumbnail) {
          const index = p.thumbnail.lastIndexOf('base64,');
          const pureBase64 = index !== -1 ? p.thumbnail.substring(index + 7) : p.thumbnail;
          p.thumbnail = toDataURL(pureBase64);
        }
      });
      setProjects(newData);
    }
    else {
      setProjects([]);
    }
  }, [data])
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const handleLogout = () => {
    console.log('aaaaaaaaa')
    setShowDropdown(false)
    logout();
  };

  const goToDetail = (project: number) => {
    setShowDropdown(false);
    console.log('dddddd', mapTypeData)
    navigation.navigate('ProjectDetail', { project: project, mapTypes: mapTypeData?.data });
  };


  const onRefresh = useCallback(() => {
    refetch()
  }, []);

  const filteredList = useMemo(() => {
    const normalizedKeyword = normalize(keyword);
    return projects.filter((item) =>
      normalize(item.name).includes(normalizedKeyword)
    );
  }, [projects, keyword]);
  const handleOutsidePress = () => {
    setShowDropdown(false)
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#3b5b16' }}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={ProjectStyles.container}>
          <View style={ProjectStyles.header}>
            <TextInput
              style={ProjectStyles.searchInput}
              placeholder={i18n.t('project.search_placeholder')}
              value={keyword}
              onChangeText={text => setKeyword(text)}
              onFocus={() => {
                setShowDropdown(false)

              }}
            />
            <TouchableOpacity
              onPress={() => setShowDropdown((prev) => !prev)}
              style={ProjectStyles.avatarCircle}
            >
              <Text style={ProjectStyles.avatarText}>{avatarInitial}</Text>
            </TouchableOpacity>

          </View>
          {showDropdown && (
            <View style={ProjectStyles.dropdownMenu}>
              <TouchableOpacity onPress={handleLogout} style={ProjectStyles.dropdownItem}>
                {/* <Icon name="logout" color="red" style={{ marginRight: 8 }} /> */}
                <Text style={{ color: 'red' }}>{i18n.t('common.logout')}</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={ProjectStyles.projectContainer}>
            <View style={ProjectStyles.projectHeader}>
              <Text style={ProjectStyles.projectTitle}>{i18n.t('project.name')}</Text>
              <TouchableOpacity onPress={toggleViewMode}>
                <Icon
                  name={viewMode === 'grid' ? 'view-grid' : 'format-list-bulleted'}
                  size={24}
                  color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            } contentContainerStyle={viewMode === 'grid' ? ProjectStyles.grid : undefined}>
              {filteredList.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  style={viewMode === 'grid' ? ProjectStyles.projectCardGrid : ProjectStyles.projectCardList}
                  onPress={() => goToDetail(project)}
                >
                  <Image source={project.thumbnail ? project.thumbnail : Images.loginBg} style={viewMode === 'grid' ? ProjectStyles.thumbnail : ProjectStyles.thumbnailList} />
                  {viewMode === 'grid' ? (
                    <View style={ProjectStyles.gridContent}>
                      {/* <Icon name="star" style={ProjectStyles.icon} /> */}
                      <View>
                        <Text style={ProjectStyles.projectName} numberOfLines={2} ellipsizeMode="tail">
                          {project.name}
                        </Text>
                        <Text style={ProjectStyles.projectDate} numberOfLines={2} ellipsizeMode="tail">
                          {`${project.from_date} - ${project.to_date}`}
                        </Text>
                        <Text style={ProjectStyles.projectEdited} numberOfLines={2} ellipsizeMode="tail">
                          {`${i18n.t('common.edited')} ${project.updated_at_str}`}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={ProjectStyles.listContent}>
                      <View>
                        <Text style={ProjectStyles.projectName} numberOfLines={2} ellipsizeMode="tail">
                          {project.name}
                        </Text>
                        <Text style={ProjectStyles.projectDate} numberOfLines={2} ellipsizeMode="tail">
                          {`${project.from_date} - ${project.to_date}`}
                        </Text>
                        <Text style={ProjectStyles.projectEdited} numberOfLines={2} ellipsizeMode="tail">
                          {`${i18n.t('common.edited')} ${project.updated_at_str}`}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

