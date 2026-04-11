import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MessageCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react'; // 추가
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator, // 추가
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client'; // 추가

const ChatHistory = () => {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState([]); // 상태로 관리
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // 프로젝트 팀의 목록 조회 API (예시: /api/chatBot/list 또는 stats 사용 가능 여부 확인 필요)
        const response = await client.get('/api/chatBot/list'); 
        if (response.data && response.data.data) {
          setHistoryData(response.data.data);
        }
      } catch (error) {
        console.error('상담 기록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 기록</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color="#5AA9E6" /></View>
      ) : (
        <ScrollView style={{ backgroundColor: '#F8FAFC' }} contentContainerStyle={styles.listContainer}>
          {historyData.map((item) => (
            <TouchableOpacity
              key={item.chatingRoomId || item.id}
              style={styles.historyCard}
              onPress={() => navigation.navigate('ChatDetail', { id: item.chatingRoomId || item.id })}
            >
              <View style={styles.cardIcon}><MessageCircle size={22} color="#5AA9E6" /></View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardDate}>{item.date || item.createdAt}</Text>
                <Text style={styles.cardSummary} numberOfLines={1}>{item.summary || '상담 기록 상세 보기'}</Text>
              </View>
              <ChevronLeft size={18} color="#CBD5E1" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ChatHistory;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  backBtn: { padding: 4 },

  listContainer: { padding: 20, paddingBottom: 40, gap: 12 },

  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10 },
      android: { elevation: 1 },
    }),
  },
  cardIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  cardInfo: { flex: 1 },
  cardDate: { fontSize: 12, fontWeight: '800', color: '#5AA9E6', marginBottom: 4 },
  cardSummary: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
});
