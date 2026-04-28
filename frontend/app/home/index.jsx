import { useNavigation } from '@react-navigation/native';
import { BotMessageSquare, ChevronRight, Quote, Users } from 'lucide-react-native';
import {
  Dimensions,
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
import Swiper from 'react-native-swiper';
import { getBannerList } from '../api/bannerApi';
import { getUserSearch } from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navigation from '../../components/Navigation';
import { useEffect, useState, useCallback } from 'react';

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

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const dateToString = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const getWeekDays = () => {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const getStreak = (dates) => {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (dates.includes(dateToString(d))) streak++;
    else break;
  }
  return streak;
};

const MainHome = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [characterImage, setCharacterImage] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [attendedDates, setAttendedDates] = useState([]);
  const [isCheckedToday, setIsCheckedToday] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('🔍 저장된 token:', token);
        if (!token) {
          console.warn('⚠️ token이 없습니다. 로그인 상태를 확인하세요.');
          return;
        }

        const result = await getUserSearch(token);
        console.log('👤 유저 정보 응답:', JSON.stringify(result, null, 2));
        if (result && result.code === 'SUCCESS' && result.data) {
          setUserName(result.data.nickname || result.data.loginId || '유저');
          if (result.data.characterImage) {
            setCharacterImage(result.data.characterImage);
            await AsyncStorage.setItem('characterImage', result.data.characterImage);
          } else {
            const cached = await AsyncStorage.getItem('characterImage');
            if (cached) setCharacterImage(cached);
          }
        }
      } catch (error) {
        console.error('유저 정보 로드 실패:', error);
      }
    };

    const fetchQuotes = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.warn('token이 없습니다. 명언 목록을 불러오지 않습니다.');
          return;
        }

        const result = await getBannerList(token);
        if (result && result.code === "SUCCESS" && result.data) {
          const formattedQuotes = result.data.map((item, index) => ({
            id: item.bannerId || index,
            text: item.content || '소중한 하루 보내세요.',
            accent: index % 2 === 0 ? '#5AA9E6' : '#7BBCEB',
          }));
          setQuotes(formattedQuotes);
        }
      } catch (error) {
        console.error('명언 목록 로드 실패:', error);
      }
    };

    const loadAttendance = async () => {
      try {
        const stored = await AsyncStorage.getItem('attendance');
        const dates = stored ? JSON.parse(stored) : [];
        setAttendedDates(dates);
        setIsCheckedToday(dates.includes(getTodayString()));
      } catch (error) {
        console.error('출석 데이터 로드 실패:', error);
      }
    };

    fetchUserInfo();
    fetchQuotes();
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    if (isCheckedToday) return;
    const todayStr = getTodayString();
    const newDates = [...attendedDates, todayStr];
    try {
      await AsyncStorage.setItem('attendance', JSON.stringify(newDates));
      setAttendedDates(newDates);
      setIsCheckedToday(true);
    } catch (error) {
      console.error('출석 체크 저장 실패:', error);
    }
  };

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
            <TouchableOpacity
              style={styles.userAvatar}
              onPress={() => navigation.navigate('Character')}
              activeOpacity={0.85}
            >
              {characterImage ? (
                <Image
                  source={{ uri: characterImage }}
                  style={styles.userAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.userAvatarText}>{userName ? userName[0] : ''}</Text>
              )}
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userGreeting}>
                <Text style={styles.userNameHighlight}>{userName}</Text>님,
              </Text>
              <Text style={styles.userGreetingSub}>{getGreeting()} 👋</Text>
              <Text style={styles.dateText}>{getDateString()}</Text>
            </View>
          </View>
        </View>

        {/* ── 섹션 2: 출석 체크 ── */}
        <View style={styles.section}>
          <SectionHeader title="출석 체크" />
          <View style={styles.attendanceWeekRow}>
            {getWeekDays().map((day, i) => {
              const dateStr = dateToString(day);
              const todayStr = getTodayString();
              const isToday = dateStr === todayStr;
              const attended = attendedDates.includes(dateStr);
              const isFuture = dateStr > todayStr;
              return (
                <View key={i} style={styles.attendanceDayCol}>
                  <Text style={styles.attendanceDayLabel}>{DAY_LABELS[i]}</Text>
                  <View style={[
                    styles.attendanceDot,
                    attended && styles.attendanceDotDone,
                    isToday && !attended && styles.attendanceDotToday,
                    isFuture && styles.attendanceDotFuture,
                  ]}>
                    {attended
                      ? <Text style={styles.attendanceCheck}>✓</Text>
                      : <Text style={[styles.attendanceDateNum, isFuture && styles.attendanceDateNumFuture]}>
                          {day.getDate()}
                        </Text>
                    }
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.attendanceFooter}>
            {getStreak(attendedDates) > 0 && (
              <Text style={styles.streakText}>
                🔥 {getStreak(attendedDates)}일 연속 출석 중
              </Text>
            )}
            <TouchableOpacity
              style={[styles.checkInBtn, isCheckedToday && styles.checkInBtnDone]}
              onPress={handleCheckIn}
              activeOpacity={isCheckedToday ? 1 : 0.8}
            >
              <Text style={[styles.checkInBtnText, isCheckedToday && styles.checkInBtnTextDone]}>
                {isCheckedToday ? '오늘 출석 완료 ✓' : '오늘 출석하기'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 섹션 3: 오늘의 명언 ── */}
        <View style={styles.section}>
          <SectionHeader title="오늘의 명언" />
          <View style={styles.swiperContainer}>
            {/* ✅ quotes 데이터가 있을 때만 Swiper 렌더링 */}
            {quotes.length > 0 ? (
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
                  <TouchableOpacity
                    key={quote.id}
                    style={[styles.slide, { backgroundColor: quote.accent }]}
                    onPress={() => navigation.navigate('Quotes')}
                    activeOpacity={0.9}
                  >
                    <View style={styles.quoteIconWrap}>
                      <Quote size={20} color="rgba(255,255,255,0.6)" />
                    </View>
                    <Text
                      style={styles.quoteText}
                      numberOfLines={4}
                      adjustsFontSizeToFit
                      minimumFontScale={0.85}
                    >
                      {quote.text}
                    </Text>
                    <View style={styles.viewAllBtn}>
                      <Text style={styles.viewAllText}>명언 더보기</Text>
                      <ChevronRight size={13} color="rgba(255,255,255,0.9)" />
                    </View>
                  </TouchableOpacity>
                ))}
              </Swiper>
            ) : (
              <View style={[styles.slide, styles.emptyQuoteSlide]}>
                 <Text style={styles.emptyQuoteText}>명언을 불러오는 중입니다...</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── 섹션 4: 빠른 메뉴 ── */}
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

        {/* ── 섹션 5: 배너 ── */}
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
    overflow: 'hidden',
  },
  userAvatarImage: {
    width: '100%',
    height: '100%',
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
  swiper: {
    height: 220,
  },
  slide: {
    height: 220,
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 38,
    justifyContent: 'flex-start',
  },
  quoteIconWrap: {
    height: 24,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#ffffff',
    minHeight: 72,
    maxHeight: 96,
    marginBottom: 8,
    includeFontPadding: false,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 3,
    alignSelf: 'flex-start',
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
  emptyQuoteSlide: {
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyQuoteText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
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

  /* Attendance */
  attendanceWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  attendanceDayCol: {
    alignItems: 'center',
    gap: 6,
  },
  attendanceDayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  attendanceDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceDotDone: {
    backgroundColor: '#5AA9E6',
  },
  attendanceDotToday: {
    backgroundColor: '#EAF4FD',
    borderWidth: 2,
    borderColor: '#5AA9E6',
  },
  attendanceDotFuture: {
    backgroundColor: '#F4F8FC',
  },
  attendanceCheck: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  attendanceDateNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5AA9E6',
  },
  attendanceDateNumFuture: {
    color: '#C8D8E8',
  },
  attendanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  checkInBtn: {
    backgroundColor: '#5AA9E6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  checkInBtnDone: {
    backgroundColor: '#EAF4FD',
  },
  checkInBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  checkInBtnTextDone: {
    color: '#5AA9E6',
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
