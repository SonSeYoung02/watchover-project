import { useNavigation } from '@react-navigation/native';
import { BotMessageSquare, ChevronRight, Quote, Users } from 'lucide-react-native';
import { useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

import Navigation from '../../components/Navigation';

const { width } = Dimensions.get('window');

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '깊은 밤이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
};

const getDateString = () => {
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`;
};

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionAccent} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const MainHome = () => {
  const navigation = useNavigation();
  const userName = 'TestUser'; // TODO: 실제 유저 데이터 연동

  const [quotes] = useState([
    {
      id: 1,
      text: '자기 사상의 밑바탕을 바꿀 수 없는 사람은\n결코 현실을 바꾸지 못한다.',
      author: '안와르 엘 사다트',
      accent: '#5AA9E6',
    },
    {
      id: 2,
      text: '어제와 똑같이 살면서\n다른 미래를 기대하는 것은 정신병 초기 증세다.',
      author: '알베르트 아인슈타인',
      accent: '#7B9FE0',
    },
    {
      id: 3,
      text: '당신이 할 수 있다고 믿든 할 수 없다고 믿든,\n당신의 믿음이 옳다.',
      author: '헨리 포드',
      accent: '#6EC6C6',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appLogo}>Cares.</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 섹션 1: 유저 카드 ── */}
        <View style={styles.section}>
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{userName[0]}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userGreeting}>
                <Text style={styles.userNameHighlight}>{userName}</Text>님,
              </Text>
              <Text style={styles.userGreetingSub}>{getGreeting()} 👋</Text>
              <Text style={styles.dateText}>{getDateString()}</Text>
            </View>
          </View>
        </View>

        {/* ── 섹션 2: 오늘의 명언 ── */}
        <View style={styles.section}>
          <SectionHeader title="오늘의 명언" />
          <View style={styles.swiperContainer}>
            <Swiper
              style={styles.swiper}
              autoplay
              autoplayTimeout={5}
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={{ bottom: 14 }}
              loop
            >
              {quotes.map((quote) => (
                <View key={quote.id} style={[styles.slide, { backgroundColor: quote.accent }]}>
                  <View style={styles.quoteIconWrap}>
                    <Quote size={20} color="rgba(255,255,255,0.6)" />
                  </View>
                  <Text style={styles.quoteText}>{quote.text}</Text>
                  <Text style={styles.quoteAuthor}>— {quote.author}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Quotes')}
                    style={styles.viewAllBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>명언 더보기</Text>
                    <ChevronRight size={13} color="rgba(255,255,255,0.9)" />
                  </TouchableOpacity>
                </View>
              ))}
            </Swiper>
          </View>
        </View>

        {/* ── 섹션 3: 빠른 메뉴 ── */}
        <View style={styles.section}>
          <SectionHeader title="지금 바로 시작해요" />
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AiChat')}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#EAF4FD' }]}>
                <BotMessageSquare size={28} color="#5AA9E6" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>AI 채팅</Text>
                <Text style={styles.actionSub}>무엇이든 털어놓으세요</Text>
              </View>
              <ChevronRight size={18} color="#C8D8E8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Community')}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#EAF4FD' }]}>
                <Users size={28} color="#5AA9E6" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>커뮤니티</Text>
                <Text style={styles.actionSub}>고민을 함께 나눠요</Text>
              </View>
              <ChevronRight size={18} color="#C8D8E8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 섹션 4: 배너 ── */}
        <View style={styles.section}>
          <SectionHeader title="마음 돌봄" />
          <View style={styles.bannerCard}>
            <View>
              <Text style={styles.bannerTitle}>오늘 기분은 어떤가요?</Text>
              <Text style={styles.bannerSub}>AI와 대화하며 마음을 돌봐요</Text>
            </View>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => navigation.navigate('AiChat')}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerBtnText}>대화 시작</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
};

export default MainHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 6,
  },

  /* Header */
  header: {
    paddingHorizontal: 25,
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: Platform.OS === 'android' ? 10 : 0,
    backgroundColor: '#ffffff',
  },
  appLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5AA9E6',
    letterSpacing: -1,
  },

  /* Section wrapper */
  section: {
    backgroundColor: '#F4F8FC',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#5AA9E6',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },

  /* User Card */
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EAF4FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  userAvatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#5AA9E6',
  },
  userInfo: {
    flex: 1,
  },
  userGreeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 30,
  },
  userGreetingSub: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  userNameHighlight: {
    fontWeight: '900',
    color: '#5AA9E6',
  },
  dateText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
  },

  /* Swiper */
  swiperContainer: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  swiper: {},
  slide: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 26,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  quoteIconWrap: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 3,
  },
  viewAllText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  dot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    width: 18, height: 6, borderRadius: 3, backgroundColor: '#ffffff',
  },

  /* Action Cards */
  actionSection: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EEF3F8',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  actionSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Banner */
  bannerCard: {
    backgroundColor: '#5AA9E6',
    borderRadius: 18,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  bannerBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5AA9E6',
  },
});
