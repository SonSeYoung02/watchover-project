import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MessageCircle, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator, // 추가
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteAllChatRooms, getChatList } from '../api/chatApi';

const ChatHistory = () => {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.warn("토큰이 없습니다.");
          return;
        }
        
        // API 함수 호출 방식으로 변경
        const result = await getChatList(token); 
        
        if (result && result.data) {
          setHistoryData(result.data);
        }
      } catch (error) {
        console.error('상담 기록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteAll = async () => {
    if (historyData.length === 0) return;

    Alert.alert('상담 기록 삭제', '모든 상담 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) return;

            await deleteAllChatRooms(token);
            await AsyncStorage.removeItem('lastChatRoomId');
            setHistoryData([]);
          } catch (error) {
            console.error('상담 기록 전체 삭제 실패:', error);
            Alert.alert('오류', '상담 기록을 삭제하지 못했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 기록</Text>
        <TouchableOpacity
          onPress={handleDeleteAll}
          style={[styles.deleteAllBtn, historyData.length === 0 && styles.deleteAllBtnDisabled]}
          disabled={historyData.length === 0}
        >
          <Trash2 size={20} color={historyData.length === 0 ? "#CBD5E1" : "#FF5A5F"} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color="#5AA9E6" /></View>
      ) : (
        <ScrollView style={{ backgroundColor: '#F8FAFC' }} contentContainerStyle={styles.listContainer}>
          {historyData.length > 0 ? (
            historyData.map((item) => (
              <TouchableOpacity
                key={item.chatRoomId || item.id}
                style={styles.historyCard}
                onPress={() => navigation.navigate('ChatDetail', { id: item.chatRoomId || item.id })}
              >
                <View style={styles.cardIcon}><MessageCircle size={22} color="#5AA9E6" /></View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardDate}>{item.date || item.createdAt}</Text>
                  <Text style={styles.cardSummary} numberOfLines={1}>{item.summary || '상담 기록 상세 보기'}</Text>
                </View>
                <ChevronLeft size={18} color="#CBD5E1" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>상담 기록이 없습니다.</Text>
              <Text style={styles.emptySub}>새 상담을 시작하면 여기에 기록됩니다.</Text>
              </View>
          )}
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
  deleteAllBtn: { padding: 8 },
  deleteAllBtnDisabled: { opacity: 0.5 },

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
  emptyBox: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
