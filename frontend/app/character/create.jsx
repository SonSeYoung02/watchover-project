import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CharacterCreate() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userPhoto } = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('CharacterResult', { userPhoto });
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigation, userPhoto]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.overlay}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3532/3532851.png' }}
            style={styles.characterImg}
            resizeMode="contain"
          />
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#82C9F9" />
          </View>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.mainInfoText}>캐릭터 생성 중...</Text>
          <Text style={styles.subInfoText}>
            AI가 사진을 분석하여{'\n'}나만의 캐릭터를 그려내고 있습니다.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1C1E' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  imageContainer: { marginBottom: 50, alignItems: 'center', justifyContent: 'center' },
  characterImg: { width: 140, height: 140, marginBottom: 10 },
  loaderWrapper: { marginTop: 20 },
  textGroup: { alignItems: 'center', marginBottom: 100 },
  mainInfoText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 },
  subInfoText: { fontSize: 15, color: '#AEAEB2', textAlign: 'center', lineHeight: 22 },
  cancelBtn: {
    position: 'absolute', bottom: 60,
    paddingVertical: 14, paddingHorizontal: 50, borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelBtnText: { color: '#E5E5EA', fontSize: 16, fontWeight: '600' },
});
