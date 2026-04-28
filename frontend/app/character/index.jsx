import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyCharacterImages, selectMyCharacterImage } from '../api/characterApi';

export default function CharacterIndex() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [characterImages, setCharacterImages] = useState([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  useEffect(() => {
    const loadCharacterImages = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const storedProfileImage = await AsyncStorage.getItem('selectedProfileImage');
        setSelectedProfileImage(storedProfileImage);

        if (!token) return;

        const result = await getMyCharacterImages(token);
        if (result?.code === 'SUCCESS' && Array.isArray(result.data)) {
          setCharacterImages(result.data);
        }
      } catch (error) {
        console.error('캐릭터 이미지 목록 로드 실패:', error);
      }
    };

    loadCharacterImages();
  }, []);

  const selectProfileImage = async (imageUrl) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('알림', '로그인이 필요합니다.');
        return;
      }

      await selectMyCharacterImage(imageUrl, token);
      await AsyncStorage.setItem('selectedProfileImage', imageUrl);
      await AsyncStorage.setItem('characterImage', imageUrl);
      setSelectedProfileImage(imageUrl);
      Alert.alert('프로필 설정', '선택한 캐릭터가 홈 프로필에 표시됩니다.');
    } catch (error) {
      console.error('프로필 이미지 저장 실패:', error);
      Alert.alert('오류', '프로필 이미지를 저장하지 못했습니다.');
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1, selectionLimit: 1 },
      (response) => {
        if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
          setImage(response.assets[0].uri);
        }
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>캐릭터</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>나만의 캐릭터 만들기</Text>
        <Text style={styles.pageSubtitle}>본인의 얼굴이 잘 나온 사진을 올려주세요</Text>

        <TouchableOpacity style={styles.uploadCard} onPress={pickImage} activeOpacity={0.7}>
          {image ? (
            <Image source={{ uri: image }} style={styles.img} />
          ) : (
            <View style={styles.placeholder}>
              <View style={styles.plusCircle}>
                <Text style={styles.plusText}>+</Text>
              </View>
              <Text style={styles.uploadBoxText}>사진 업로드</Text>
              <Text style={styles.uploadBoxSub}>탭하여 갤러리에서 선택</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>저장된 캐릭터</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.savedList}
          >
            {characterImages.length > 0 ? (
              characterImages.map((imageUrl) => {
                const isSelected = selectedProfileImage === imageUrl;
                return (
                  <TouchableOpacity
                    key={imageUrl}
                    style={[styles.savedImageButton, isSelected && styles.savedImageSelected]}
                    onPress={() => selectProfileImage(imageUrl)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: imageUrl }} style={styles.savedImage} />
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>선택됨</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptySavedBox}>
                <Text style={styles.emptySavedText}>아직 저장된 캐릭터가 없습니다.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.genBtn}
          onPress={() => navigation.navigate('CharacterCreate', { userPhoto: image })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>캐릭터 생성하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '800',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333333',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 24,
  },
  uploadCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E6E6EA',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D1D6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
  },
  plusCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#5AA9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  plusText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '300',
  },
  uploadBoxText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 4,
  },
  uploadBoxSub: {
    fontSize: 12,
    color: '#888888',
  },
  savedSection: {
    marginBottom: 20,
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 10,
  },
  savedList: {
    minHeight: 118,
    gap: 12,
    paddingRight: 4,
  },
  savedImageButton: {
    width: 96,
    height: 112,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  savedImageSelected: {
    borderColor: '#5AA9E6',
  },
  savedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedBadge: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(90, 169, 230, 0.92)',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  emptySavedBox: {
    width: 260,
    height: 112,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySavedText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  genBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#5AA9E6',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#5AA9E6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
