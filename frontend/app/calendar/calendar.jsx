import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-gifted-charts";

import { postDailyEmotion, getMonthlyStatistics } from "../api/calendarApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EMOTION_COLORS = {
  기쁨: "#5AA9E6",
  행복: "#5AA9E6",
  평온: "#7CC9A7",
  슬픔: "#A5D3F5",
  화남: "#F28B82",
  혐오: "#B8A4D8",
  불안: "#F6C177",
};

const Calendar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    fetchStatistics();
  }, [currentYear, currentMonth]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("알림", "로그인이 필요합니다.");
      navigation.navigate("Login");
      return null;
    }
    return token;
  };

  const resolveChatRoomId = async () => {
    const routeChatRoomId = route.params?.chatRoomId;
    if (routeChatRoomId) {
      return routeChatRoomId;
    }
    return AsyncStorage.getItem("lastChatRoomId");
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        return;
      }

      const result = await getMonthlyStatistics(
        token,
        currentYear,
        currentMonth + 1,
      );
      const stats = Array.isArray(result?.data) ? result.data : [];

      const formattedData = stats
        .filter((item) => Number(item.count) > 0)
        .map((item) => ({
          value: Number(item.count),
          label: item.emotion,
          color: EMOTION_COLORS[item.emotion] || "#E6F2FC",
          gradientCenterColor: EMOTION_COLORS[item.emotion] || "#8EC9F8",
        }));

      setChartData(formattedData);
    } catch (error) {
      console.log("통계 데이터 로딩 에러");
      if (error.response) {
        console.log("상태 코드:", error.response.status);
        console.log("서버 응답:", JSON.stringify(error.response.data));
      }
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDatePress = async (day) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));

    try {
      const token = await getToken();
      if (!token) {
        return;
      }

      const chatRoomId = await resolveChatRoomId();
      if (!chatRoomId) {
        Alert.alert("알림", "분석할 채팅방이 없습니다. 먼저 AI 상담을 진행해 주세요.");
        return;
      }

      setAnalyzing(true);
      const selectedDateText = [
        currentYear,
        String(currentMonth + 1).padStart(2, "0"),
        String(day).padStart(2, "0"),
      ].join("-");
      const result = await postDailyEmotion(chatRoomId, token, selectedDateText);
      const emotion = result?.data?.emotion;

      if (emotion) {
        Alert.alert(
          `${day}일 감정 분석`,
          `오늘의 주된 감정은 [${emotion}]입니다.`,
        );
        fetchStatistics();
      }
    } catch (error) {
      console.log("일일 감정 분석 실패");
      if (error.response) {
        console.log("상태 코드:", error.response.status);
        console.log("서버 응답:", JSON.stringify(error.response.data));
      }
      Alert.alert("알림", "분석할 대화 데이터가 충분하지 않습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dynamicDays = Array.from({ length: lastDay }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>달력 및 통계</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.yearRow}>
            <Text style={styles.yearText}>{currentYear}년</Text>
          </View>
          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={prevMonth} style={styles.arrowBtn}>
              <ChevronLeft size={24} color="#5AA9E6" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth + 1}월</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.arrowBtn}>
              <ChevronRight size={24} color="#5AA9E6" />
            </TouchableOpacity>
          </View>
          <View style={styles.calendarGrid}>
            {DAYS.map((day, idx) => (
              <View key={`day-${idx}`} style={styles.dayCellContainer}>
                <Text
                  style={[
                    styles.dayCellText,
                    idx === 0 && { color: "#FF5A5F" },
                    idx === 6 && { color: "#5AA9E6" },
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
            {emptyDays.map((_, idx) => (
              <View key={`empty-${idx}`} style={styles.dateCell} />
            ))}
            {dynamicDays.map((day) => {
              const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth;
              const dayOfWeek = (firstDayIndex + day - 1) % 7;
              const color =
                dayOfWeek === 0
                  ? "#FF5A5F"
                  : dayOfWeek === 6
                    ? "#5AA9E6"
                    : "#333";
              return (
                <TouchableOpacity
                  key={`date-${day}`}
                  style={styles.dateCell}
                  onPress={() => handleDatePress(day)}
                  disabled={analyzing}
                >
                  <View
                    style={[
                      styles.dateInner,
                      isSelected && styles.dateInnerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !isSelected && { color },
                        isSelected && styles.dateTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.statsTitle}>{currentMonth + 1}월 감정 통계</Text>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#5AA9E6"
              style={{ marginVertical: 30 }}
            />
          ) : chartData.length > 0 ? (
            <View style={styles.chartWrapper}>
              <PieChart
                data={chartData}
                donut
                radius={100}
                innerRadius={65}
                centerLabelComponent={() => (
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    분석완료
                  </Text>
                )}
              />
              <View style={styles.legendContainer}>
                {chartData.map((item, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{item.value}회</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>기록된 데이터가 없습니다.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: { fontSize: 18, color: "#111111", fontWeight: "800" },
  backBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  yearRow: { alignItems: "center", marginBottom: 4 },
  yearText: { fontSize: 13, fontWeight: "700", color: "#888888" },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 30,
  },
  arrowBtn: { padding: 4 },
  monthText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#333333",
    minWidth: 70,
    textAlign: "center",
  },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCellContainer: { width: "14.28%", marginBottom: 12, alignItems: "center" },
  dayCellText: { color: "#888888", fontSize: 11, fontWeight: "800" },
  dateCell: {
    width: "14.28%",
    height: Math.min(85, SCREEN_WIDTH * 0.13),
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  dateInner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 6,
  },
  dateInnerSelected: { backgroundColor: "#F0F0F0", borderRadius: 16 },
  dateText: { fontSize: 12, fontWeight: "600" },
  dateTextSelected: { color: "#111111", fontWeight: "800" },
  statsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 20,
  },
  loadingText: { color: "#888888", textAlign: "center", marginVertical: 20 },
  chartWrapper: { alignItems: "center" },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    gap: 15,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendLabel: { fontSize: 13, color: "#333" },
  legendValue: {
    fontSize: 13,
    color: "#888",
    fontWeight: "700",
    marginLeft: 3,
  },
});

export default Calendar;
