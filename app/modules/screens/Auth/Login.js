import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import i18n from "@app/i18n/i18n";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuth } from '@app/modules/context/AuthContext';
import { Images } from "@app/theme";


const { width, height } = Dimensions.get('window');

const Login = () => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = i18n.t('login.empty_fields');
    } else if (!/^[a-z0-9]+$/.test(username)) {
      newErrors.username = i18n.t('login.username_invalid');
    }
    if (!password.trim()) {
      newErrors.password = i18n.t('login.empty_fields');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      Alert.alert(i18n.t('login.empty_fields'));
      return;
    }
    await login(username, password);
  };

  return (
    <ImageBackground source={Images.loginBg} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={Images.logoDark} style={styles.logo} resizeMode="contain" />
          {/* <Text style={styles.appName}>{i18n.t('login.app_name')}</Text> */}
        </View>

        <View style={styles.form}>
          <View style={{ marginBottom: 12 }}>
            <TextInput
              placeholder={i18n.t('login.username_placeholder')}
              style={[styles.input, errors.username && { borderColor: 'red', borderWidth: 1 }]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={{ marginBottom: 12 }}>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={i18n.t('login.password_placeholder')}
                style={[styles.input, styles.passwordInput, errors.password && { borderColor: 'red', borderWidth: 1 }]}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{i18n.t('login.title')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 25,
    width: '80%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  logoContainer: {
    // flexDirection:'row',
    alignItems: 'center',
    // justifyContent:'center',
    marginBottom: 12,

  },
  logo: {
    width: 180,
    height: 50,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  form: {
    width: '100%',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    height: 48,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  button: {
    backgroundColor: '#1890ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
  },
});

export default Login
