import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';

export default function CharacterIndex() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

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
