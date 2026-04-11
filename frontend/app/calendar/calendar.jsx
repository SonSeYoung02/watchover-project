import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Calendar = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const initialData = [
    { value: 45, label: '행복', color: '#5AA9E6', gradientCenterColor: '#8EC9F8' },
    { value: 20, label: '슬픔', color: '#A5D3F5', gradientCenterColor: '#C5E4F9' },
    { value: 15, label: '화남', color: '#2C5A85', gradientCenterColor: '#417AAD' },
    { value: 20, label: '평온', color: '#E6F2FC', gradientCenterColor: '#F2F8FD' },
  ];

  const [chartData] = useState(initialData);

  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDays = Array.from({ length: firstDayIndex }, (_, i) => i);
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dynamicDays = Array.from({ length: lastDay }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>달력 및 통계</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}
      >


        {/* 캘린더 카드 */}
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
                <Text style={[
                  styles.dayCellText,
                  idx === 0 && { color: '#FF5A5F' },
                  idx === 6 && { color: '#5AA9E6' }
                ]}>
                  {day}
                </Text>
              </View>
            ))}
            {emptyDays.map((_, idx) => (
              <View key={`empty-${idx}`} style={styles.dateCell} />
            ))}
            {dynamicDays.map((day) => {
              const isSelected =
                selectedDate.getFullYear() === currentYear &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getDate() === day;

              const dayOfWeek = (firstDayIndex + day - 1) % 7;
              const isSun = dayOfWeek === 0;
              const isSat = dayOfWeek === 6;
              const defaultColor = isSun ? '#FF5A5F' : isSat ? '#5AA9E6' : '#333333';

              return (
                <TouchableOpacity
                  key={`date-${day}`}
                  style={styles.dateCell}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                >
                  <View style={[styles.dateInner, isSelected && styles.dateInnerSelected]}>
                    <Text style={[
                      styles.dateText,
                      !isSelected && { color: defaultColor },
                      isSelected && styles.dateTextSelected
                    ]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 통계 카드 */}
        <View style={styles.card}>
          <Text style={styles.statsTitle}>{currentMonth + 1}월 감정 통계</Text>
          {chartData ? (
            <View style={styles.chartWrapper}>
              <PieChart
                data={chartData}
                donut
                showGradient
                sectionAutoFocus
                radius={100}
                innerRadius={65}
                innerCircleColor={'#ffffff'}
                centerLabelComponent={() => (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, color: '#333333', fontWeight: 'bold' }}>100%</Text>
                    <Text style={{ fontSize: 14, color: '#888888', marginTop: 4 }}>기록 완료</Text>
                  </View>
                )}
              />
              <View style={styles.legendContainer}>
                {chartData.map((item, index) => (
                  <View key={`legend-${index}`} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{item.value}%</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#5AA9E6" />
              <Text style={styles.loadingText}>데이터가 없음</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: '#111111',
    fontWeight: '800',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#333333',
    marginTop: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  yearRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  yearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888888',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 30,
  },
  arrowBtn: {
    padding: 4,
  },
  monthText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333333',
    minWidth: 70,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellContainer: {
    width: '14.28%',
    marginBottom: 12,
    alignItems: 'center',
  },
  dayCellText: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '800',
  },
  dateCell: {
    width: '14.28%',
    height: 85,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  dateInner: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 6,
  },
  dateInnerSelected: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  dateText: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: '#111111',
    fontWeight: '800',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888888',
    marginTop: 10,
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 25,
    paddingHorizontal: 10,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: '#333333',
    marginRight: 6,
    fontWeight: '600',
  },
  legendValue: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '700',
  },
});
