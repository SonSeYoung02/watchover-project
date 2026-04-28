import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getDailyAnalysis,
  getDailyStatistics,
  getMonthlyEmotionLogs,
  getMonthlyStatistics,
} from "../api/calendarApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 96;

const EMOTION_COLORS = {
  기쁨: "#5AA9E6",
  행복: "#5AA9E6",
  평온: "#7CC9A7",
  슬픔: "#A5D3F5",
  화남: "#F28B82",
  혐오: "#B8A4D8",
  불안: "#F6C177",
};

const EMOTION_ORDER = ["기쁨", "슬픔", "화남", "혐오", "평온", "불안"];

const normalizeEmotion = (emotion) => {
  if (!emotion) return null;
  if (emotion.includes("기쁨") || emotion.includes("행복")) return "기쁨";
  if (emotion.includes("슬픔")) return "슬픔";
  if (emotion.includes("화남") || emotion.includes("분노")) return "화남";
  if (emotion.includes("혐오")) return "혐오";
  if (emotion.includes("평온")) return "평온";
  if (emotion.includes("불안")) return "불안";
  return emotion;
};

export default function Calendar() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [emotionLogsByDate, setEmotionLogsByDate] = useState({});
  const [dailyAnalysis, setDailyAnalysis] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyStatsLoading, setDailyStatsLoading] = useState(false);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("알림", "로그인이 필요합니다.");
      navigation.navigate("Login");
      return null;
    }
    return token;
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const [statsResult, logsResult] = await Promise.all([
        getMonthlyStatistics(token, currentYear, currentMonth + 1),
        getMonthlyEmotionLogs(token, currentYear, currentMonth + 1),
      ]);

      const stats = Array.isArray(statsResult?.data) ? statsResult.data : [];
      const logs = Array.isArray(logsResult?.data) ? logsResult.data : [];

      const logsByDate = logs.reduce((acc, item) => {
        const emotion = normalizeEmotion(item.emotion);
        if (item.date && emotion) {
          acc[item.date] = {
            ...item,
            emotion,
          };
        }
        return acc;
      }, {});
      setEmotionLogsByDate(logsByDate);

      const countByEmotion = stats.reduce((acc, item) => {
        const emotion = normalizeEmotion(item.emotion);
        acc[emotion] = Number(item.count);
        return acc;
      }, {});
      const formattedData = EMOTION_ORDER.map((emotion) => ({
        value: countByEmotion[emotion] || 0,
        label: emotion,
        dataPointText: String(countByEmotion[emotion] || 0),
      }));

      setMonthlyChartData(formattedData);
    } catch (error) {
      console.log("통계 데이터 로딩 오류");
      if (error.response) {
        console.log("상태 코드:", error.response.status);
        console.log("서버 응답:", JSON.stringify(error.response.data));
      }
      setMonthlyChartData([]);
      setEmotionLogsByDate({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [currentYear, currentMonth]);

  const formatDate = (date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

  const fetchDailyAnalysis = async (date) => {
    setDailyAnalysis(null);
    setDailyLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const result = await getDailyAnalysis(token, formatDate(date));
      const data = result?.data;
      setDailyAnalysis(
        data && (data.emotion || data.summary || data.analysis)
          ? {
              ...data,
              emotion: normalizeEmotion(data.emotion),
            }
          : null,
      );
    } catch (error) {
      console.log("일별 분석 데이터 로딩 오류");
      if (error.response) {
        console.log("상태 코드:", error.response.status);
        console.log("서버 응답:", JSON.stringify(error.response.data));
      }
      setDailyAnalysis(null);
    } finally {
      setDailyLoading(false);
    }
  };

  const fetchDailyStatistics = async (date) => {
    setDailyStatsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const result = await getDailyStatistics(token, formatDate(date));
      const stats = Array.isArray(result?.data) ? result.data : [];
      const formattedData = stats
        .filter((item) => Number(item.count) > 0)
        .map((item) => {
          const emotion = normalizeEmotion(item.emotion);
          return {
            value: Number(item.count),
            label: emotion,
            color: EMOTION_COLORS[emotion] || "#E6F2FC",
            gradientCenterColor: EMOTION_COLORS[emotion] || "#8EC9F8",
          };
        });

      setDailyChartData(formattedData);
    } catch (error) {
      console.log("일별 통계 데이터 로딩 오류");
      if (error.response) {
        console.log("상태 코드:", error.response.status);
        console.log("서버 응답:", JSON.stringify(error.response.data));
      }
      setDailyChartData([]);
    } finally {
      setDailyStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyAnalysis(selectedDate);
    fetchDailyStatistics(selectedDate);
  }, [selectedDate]);

  const handleDatePress = (day) => {
    const nextSelectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(nextSelectedDate);
  };

  const moveMonth = (monthOffset) => {
    const nextDate = new Date(currentYear, currentMonth + monthOffset, 1);
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
  };

  const prevMonth = () => moveMonth(-1);
  const nextMonth = () => moveMonth(1);

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dynamicDays = Array.from({ length: lastDay }, (_, i) => i + 1);
  const selectedEmotionColor = EMOTION_COLORS[dailyAnalysis?.emotion];
  const monthlyTotal = monthlyChartData.reduce((sum, item) => sum + item.value, 0);
  const dailyTotal = dailyChartData.reduce((sum, item) => sum + item.value, 0);
  const mainDailyEmotion = dailyChartData[0];

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
            {days.map((day, idx) => (
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
              const dateKey = [
                currentYear,
                String(currentMonth + 1).padStart(2, "0"),
                String(day).padStart(2, "0"),
              ].join("-");
              const dayEmotion = emotionLogsByDate[dateKey]?.emotion;
              const emotionColor = EMOTION_COLORS[dayEmotion];
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
                    {emotionColor && (
                      <View
                        style={[
                          styles.emotionDot,
                          { backgroundColor: emotionColor },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statsHeaderRow}>
            <View>
              <Text style={styles.statsTitle}>{currentMonth + 1}월</Text>
              <Text style={styles.statsSubtitle}>감정 흐름</Text>
            </View>
            <View style={styles.statValuePill}>
              <Text style={styles.statValue}>{monthlyTotal}</Text>
              <Text style={styles.statValueLabel}>회</Text>
            </View>
          </View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#5AA9E6"
                style={{ marginVertical: 30 }}
              />
            ) : monthlyTotal > 0 ? (
              <View style={styles.progressList}>
                {monthlyChartData
                  .filter((item) => item.value > 0)
                  .map((item) => {
                    const percent = Math.round((item.value / monthlyTotal) * 100);
                    const emotionColor = EMOTION_COLORS[item.label] || "#E6F2FC";
                    return (
                      <View key={item.label} style={styles.progressItem}>
                        <View style={styles.progressHeader}>
                          <View style={styles.progressLabelRow}>
                            <View
                              style={[
                                styles.legendDot,
                                { backgroundColor: emotionColor },
                              ]}
                            />
                            <Text style={styles.progressLabel}>{item.label}</Text>
                          </View>
                          <Text style={styles.progressValue}>
                            {item.value}회 · {percent}%
                          </Text>
                        </View>
                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${percent}%`,
                                backgroundColor: emotionColor,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
              </View>
            ) : (
              <Text style={styles.loadingText}>기록된 데이터가 없습니다.</Text>
            )}
        </View>

        <View style={styles.statCard}>
          <View style={styles.statsHeaderRow}>
            <View>
              <Text style={styles.statsTitle}>
                {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
              </Text>
              <Text style={styles.statsSubtitle}>하루 대표 감정</Text>
            </View>
            <View
              style={[
                styles.emotionPill,
                {
                  backgroundColor: mainDailyEmotion?.color || "#F1F5F9",
                },
              ]}
            >
              <Text style={styles.emotionPillText}>
                {mainDailyEmotion?.label || "-"}
              </Text>
            </View>
          </View>
            {dailyStatsLoading ? (
              <ActivityIndicator
                size="large"
                color="#5AA9E6"
                style={{ marginVertical: 30 }}
              />
            ) : mainDailyEmotion ? (
              <View style={styles.dailyStatsBody}>
                <View
                  style={[
                    styles.dailyEmotionPanel,
                    { borderColor: mainDailyEmotion.color },
                  ]}
                >
                  <View
                    style={[
                      styles.dailyEmotionIcon,
                      { backgroundColor: mainDailyEmotion.color },
                    ]}
                  />
                  <View>
                    <Text style={styles.dailyEmotionLabel}>
                      {mainDailyEmotion.label}
                    </Text>
                    <Text style={styles.dailyEmotionMeta}>
                      {dailyTotal}회 기록
                    </Text>
                  </View>
                </View>
                <View style={styles.dailyMiniList}>
                  {dailyChartData.map((item) => (
                    <View key={item.label} style={styles.dailyMiniItem}>
                      <Text style={styles.dailyMiniLabel}>{item.label}</Text>
                      <Text style={styles.dailyMiniValue}>{item.value}회</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.loadingText}>선택한 날짜의 통계가 없습니다.</Text>
            )}
        </View>

        <View style={styles.card}>
          <Text style={styles.statsTitle}>
            {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 분석
          </Text>
          {dailyLoading ? (
            <ActivityIndicator
              size="small"
              color="#5AA9E6"
              style={{ marginVertical: 20 }}
            />
          ) : dailyAnalysis ? (
            <View>
              <View style={styles.selectedEmotionRow}>
                <View
                  style={[
                    styles.selectedEmotionDot,
                    { backgroundColor: selectedEmotionColor || "#E6F2FC" },
                  ]}
                />
                <Text style={styles.selectedEmotionText}>
                  {dailyAnalysis.emotion}
                </Text>
              </View>
              <Text style={styles.sectionLabel}>대화 요약</Text>
              <Text style={styles.analysisText}>
                {dailyAnalysis.summary || "저장된 대화 요약이 없습니다."}
              </Text>
              <Text style={styles.sectionLabel}>감정 분석</Text>
              <Text style={styles.analysisText}>
                {dailyAnalysis.analysis || "저장된 분석 내용이 없습니다."}
              </Text>
            </View>
          ) : (
            <Text style={styles.loadingText}>
              선택한 날짜에 대화 기반 분석이 없습니다.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  statCard: {
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
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333333",
  },
  statsSubtitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    marginTop: 3,
  },
  statsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  statValuePill: {
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "900", color: "#0284C7" },
  statValueLabel: { fontSize: 10, fontWeight: "800", color: "#64748B" },
  emotionPill: {
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  emotionPillText: { fontSize: 13, fontWeight: "900", color: "#ffffff" },
  loadingText: { color: "#888888", textAlign: "center", marginVertical: 20 },
  progressList: { gap: 14 },
  progressItem: { gap: 8 },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabelRow: { flexDirection: "row", alignItems: "center" },
  progressLabel: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "800",
  },
  progressValue: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
  dailyStatsBody: {
    gap: 14,
  },
  dailyEmotionPanel: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  dailyEmotionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    marginRight: 12,
  },
  dailyEmotionLabel: {
    fontSize: 20,
    color: "#111827",
    fontWeight: "900",
  },
  dailyEmotionMeta: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    marginTop: 3,
  },
  dailyMiniList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dailyMiniItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
  },
  dailyMiniLabel: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "800",
    marginRight: 6,
  },
  dailyMiniValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "900",
  },
  selectedEmotionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  selectedEmotionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedEmotionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "800",
  },
  sectionLabel: {
    fontSize: 13,
    color: "#5AA9E6",
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 8,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#333333",
    marginBottom: 12,
  },
});
