import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Lock } from 'lucide-react-native';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getChatDetail } from '../api/chatApi'; // 함수 임포트

const ChatDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const [chatLogs, setChatLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.warn("토큰이 없습니다.");
          return;
        }
        
        // API 함수 호출 방식으로 변경
        const result = await getChatDetail(id, token);
        
        if (result && result.data) {
          // 서버 데이터 구조에 맞춰 저장
          const logs = Array.isArray(result.data) ? result.data : (result.data.chatLogs || []);
          setChatLogs(logs);
        }
      } catch (error) {
        console.error('상세 내역 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 내역 상세</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#5AA9E6" />
      ) : (
        <ScrollView style={styles.chatMessages} contentContainerStyle={styles.scrollContent}>
          <View style={styles.historyDateBadge}>
            <Text style={styles.dateText}>대화 기록 (ID: {id})</Text>
          </View>

          {(() => {
            // Нормализация 데이터
            let normalizedLogs = [];
            chatLogs.forEach(log => {
              if (log.type === 'user' || log.type === 'ai') {
                normalizedLogs.push(log);
              } else {
                // If it's a combined object like { message: "...", answer: "..." }
                if (log.message) normalizedLogs.push({ type: 'user', text: log.message });
                if (log.answer) normalizedLogs.push({ type: 'ai', text: log.answer });
              }
            });
            
            return normalizedLogs.map((log, index) => (
              <View key={index} style={[styles.messageRow, log.type === 'ai' ? styles.aiRow : styles.userRow]}>
                {log.type === 'ai' && (
                  <View style={styles.aiAvatar}><Text style={styles.avatarText}>AI</Text></View>
                )}
                <View style={[styles.bubble, log.type === 'ai' ? styles.aiBubble : styles.userBubble]}>
                  <Text style={[styles.messageText, log.type === 'ai' ? styles.aiText : styles.userText]}>
                    {log.text || log.message || log.answer}
                  </Text>
                </View>
              </View>
            ));
          })()}
        </ScrollView>
      )}

      <View style={styles.detailFooterWrapper}>
        <View style={styles.detailFooterBubble}>
          <Lock size={14} color="#94A3B8" />
          <Text style={styles.footerText}>종료된 상담 기록입니다.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetail;

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

  chatMessages: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 120 },

  historyDateBadge: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    marginVertical: 20,
  },
  dateText: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  messageRow: { flexDirection: 'row', marginBottom: 24, maxWidth: '85%' },
  aiRow: { alignSelf: 'flex-start' },
  userRow: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },

  aiAvatar: {
    width: 38, height: 38, backgroundColor: '#E0F2FE', borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
    borderWidth: 1, borderColor: '#BAE6FD',
  },
  avatarText: { fontSize: 11, fontWeight: '800', color: '#0EA5E9' },

  bubble: {
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 1 },
    }),
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#5AA9E6',
    borderTopRightRadius: 4,
  },

  messageText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: '#334155', fontWeight: '500' },
  userText: { color: '#ffffff', fontWeight: '600' },

  detailFooterWrapper: {
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
  },
  detailFooterBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8
  },
  footerText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
});
