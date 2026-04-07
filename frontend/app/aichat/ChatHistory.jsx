import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MessageCircle } from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatHistory = () => {
  const navigation = useNavigation();

  const historyData = [
    { id: 101, date: '2025.11.20', summary: '취업 고민에 대한 대화' },
    { id: 102, date: '2025.11.18', summary: '인간관계 스트레스 상담' },
    { id: 103, date: '2025.11.15', summary: '오늘 하루 기분 기록' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Standard Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상담 기록</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: '#F8FAFC' }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {historyData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyCard}
            onPress={() => navigation.navigate('ChatDetail', { id: item.id })}
            activeOpacity={0.7}
          >
            <View style={styles.cardIcon}>
              <MessageCircle size={22} color="#5AA9E6" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardSummary} numberOfLines={1}>{item.summary}</Text>
            </View>
            <ChevronLeft size={18} color="#CBD5E1" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
