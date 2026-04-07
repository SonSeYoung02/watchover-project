import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
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

const QuoteList = () => {
  const navigation = useNavigation();

  const [quotes] = useState([
    { id: 1, text: '자기 사상의 밑바탕을 바꿀 수 없는 사람은\n결코 현실을 바꾸지 못한다.', author: '안와르 엘 사다트', bgColor: '#A3D2F3' },
    { id: 2, text: '어제와 똑같이 살면서\n다른 미래를 기대하는 것은 정신병 초기 증세다.', author: '알베르트 아인슈타인', bgColor: '#5AA9E6' },
    { id: 3, text: '당신이 할 수 있다고 믿든 할 수 없다고 믿든,\n당신의 믿음이 옳다.', author: '헨리 포드', bgColor: '#7FBBEA' },
    { id: 4, text: '성공은 최종적인 것이 아니며,\n실패는 치명적인 것이 아니다.', author: '윈스턴 처칠', bgColor: '#A3D2F3' },
    { id: 5, text: '가장 큰 위험은 위험을 감수하지 않는 것이다.', author: '마크 저커버그', bgColor: '#7FBBEA' },
  ]);

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

      <ScrollView
        style={styles.quoteScrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quotes.map((quote) => (
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
        ))}
      </ScrollView>
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
