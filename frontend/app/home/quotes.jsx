import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react'; // useEffect 추가
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator // 로딩 표시용
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../api/client'; // 서버 통신 도구

const QuoteList = () => {
  const navigation = useNavigation();
  const [quotes, setQuotes] = useState([]); // 서버 데이터를 담을 공간
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllQuotes = async () => {
      try {
        setIsLoading(true);
        // '전체 목록 API'가 있는지 확인 전까지는 
        // 일단 여러 개의 ID를 순차적으로 가져오거나, 
        // 전체 리스트 API(예: /api/banners/list)가 있다고 가정하고 요청합니다.
        const response = await client.get('/api/banners/1'); // 우선 1번만 테스트
        
        if (response.data && response.data.data) {
          // 서버 응답 구조 { message }를 UI 변수 { text }에 맞게 변환
          const serverData = [{
            id: 1,
            text: response.data.data.message || '내용이 없습니다.',
            author: 'Care AI',
            bgColor: '#5AA9E6'
          }];
          setQuotes(serverData);
        }
      } catch (error) {
        console.error('명언 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllQuotes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>명언 목록</Text>
        <View style={{ width: 28 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#5AA9E6" />
        </View>
      ) : (
        <ScrollView
          style={styles.quoteScrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <View
                key={quote.id}
                style={[styles.quoteListCard, { backgroundColor: quote.bgColor }]}
              >
                <View style={styles.quoteTagContainer}>
                  <Text style={styles.quoteTagText}>명언</Text>
                </View>
                <Text style={styles.quoteText}>{quote.text}</Text>
                <Text style={styles.quoteAuthor}>- {quote.author} -</Text>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#999' }}>
              등록된 명언이 없습니다.
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default QuoteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  backBtn: { padding: 4 },
  quoteScrollArea: { flex: 1 },
  scrollContent: {
    padding: 20,
    gap: 15,
  },
  quoteListCard: {
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  quoteTagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 15,
    marginBottom: 15,
  },
  quoteTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  quoteText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
