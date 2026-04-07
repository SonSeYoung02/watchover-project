import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
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

export default function CharacterResult() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userPhoto } = route.params || {};

  const currentImage = userPhoto || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결과 확인</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.imageCard}>
          <Image source={{ uri: currentImage }} style={styles.resultImg} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI 생성 완료</Text>
          </View>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.mainTitle}>멋진 캐릭터가 완성됐어요!</Text>
          <Text style={styles.subTitle}>세상에 하나뿐인 나만의 캐릭터입니다.</Text>
        </View>

        <TouchableOpacity
          style={styles.decideBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>프로필로 결정</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    height: Platform.OS === 'android' ? 100 : 60,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  backBtn: { padding: 4 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 },
  imageCard: {
    width: 300, height: 300, borderRadius: 30, backgroundColor: '#F2F2F7',
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15, shadowRadius: 10, marginBottom: 30, position: 'relative',
  },
  resultImg: { width: '100%', height: '100%', borderRadius: 30, resizeMode: 'cover' },
  badge: {
    position: 'absolute', bottom: -15, backgroundColor: '#34C759',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignSelf: 'center',
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  textGroup: { alignItems: 'center', marginBottom: 50 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 12 },
  subTitle: { fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 22 },
  decideBtn: {
    backgroundColor: '#82C9F9', width: '100%', height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 40,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
