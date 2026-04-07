import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
// ✅ 네비게이션 컴포넌트 추가 (경로 확인 필요)
import Navigation from "../../components/Navigation";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Calendar = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const initialData = [
    { value: 45, label: "행복", frontColor: "#5AA9E6" },
    { value: 20, label: "슬픔", frontColor: "#7FBBEA" },
    { value: 15, label: "화남", frontColor: "#FF5A5F" },
    { value: 20, label: "평온", frontColor: "#A3D2F3" },
  ];

  const [chartData] = useState(initialData);

  const CHART_WIDTH = SCREEN_WIDTH - 70;
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 월 이동 로직
  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  // ✅ 핵심 로직: 1일의 요일 위치 및 빈 칸 계산
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dynamicDays = Array.from({ length: lastDay }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={32} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>달력 및 통계</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.calendarApp}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // 네비게이션 공간 확보
      >
        {/* 2. 달력 섹션 */}
        <View style={styles.calendarSection}>
          <View style={styles.yearSection}>
            <Text style={styles.yearTitleSection}>{currentYear} 년</Text>
          </View>

          <View style={styles.monthSelector}>
            <TouchableOpacity onPress={prevMonth}>
              <ChevronLeft size={40} color="white" />
            </TouchableOpacity>
            <Text style={styles.monthSelectorTitle}>{currentMonth + 1} 월</Text>
            <TouchableOpacity onPress={nextMonth}>
              <ChevronRight size={40} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGrid}>
            {DAYS.map((day, idx) => (
              <View key={`day-${idx}`} style={styles.dayCellContainer}>
                <Text
                  style={[
                    styles.dayCellText,
                    idx === 0 && { color: "#FF5A5F" },
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}

            {/* ✅ 1일 시작 전 빈 칸 렌더링 */}
            {emptyDays.map((_, idx) => (
              <View key={`empty-${idx}`} style={styles.dateCell} />
            ))}

            {/* 실제 날짜 렌더링 */}
            {dynamicDays.map((day) => (
              <TouchableOpacity key={`date-${day}`} style={styles.dateCell}>
                <View style={styles.dateInner}>
                  <Text style={styles.dateText}>{day}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. 통계 섹션 */}
        <View style={styles.statsCard}>
          <View style={styles.calendarStatsSection}>
            <Text style={styles.statsTitle}>
              {currentMonth + 1}월 감정 통계
            </Text>
          </View>

          {chartData ? (
            <BarChart
              data={chartData}
              barWidth={22}
              spacing={35}
              roundedTop
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "#b8bcc3", fontSize: 10 }}
              xAxisLabelTextStyle={{
                color: "#fff",
                fontSize: 12,
                fontWeight: "700",
              }}
              noOfSections={4}
              maxValue={100}
              isAnimated
              animationDuration={1200}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#00f2fe" />
              <Text style={styles.loadingText}>데이터가 없음</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 4. 하단 네비게이션 바 */}
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  calendarApp: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  calendarSection: {
    backgroundColor: "#57595c", // 캡처 화면 톤
    borderRadius: 25,
    marginVertical: 15,
    marginHorizontal: 16,
    padding: 20,
    elevation: 5,
  },
  yearSection: {
    alignItems: "center",
    marginBottom: 5,
  },
  yearTitleSection: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 30,
  },
  monthSelectorTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    minWidth: 70,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCellContainer: {
    width: "14.28%",
    marginBottom: 15,
    alignItems: "center",
  },
  dayCellText: {
    color: "#b8bcc3",
    fontSize: 11,
    fontWeight: "800",
  },
  dateCell: {
    width: "14.28%",
    height: 55,
    padding: 4,
  },
  dateInner: {
    flex: 1,
    backgroundColor: "#3a3d41",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: "#3a3d41",
    borderRadius: 25,
    padding: 25,
    marginHorizontal: 16,
    marginBottom: 20,
    elevation: 8,
  },
  calendarStatsSection: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  statsTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#b8bcc3",
    marginTop: 10,
  },
});

export default Calendar;
