import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronLeft, Clock, Search, TrendingUp, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ 키 이름을 아예 새롭게 바꿉니다 (기존의 잘못된 데이터 무시용)
const STORAGE_KEY = "@CARES_STORAGE_V3_FINAL";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);

  // ✅ 1. 데이터 로드 (안전 장치 추가)
  const fetchKeywords = async () => {
    try {
      const result = await AsyncStorage.getItem(STORAGE_KEY);
      if (result) {
        const parsed = JSON.parse(result);
        // 만약 가져온 데이터가 배열이 아니면 빈 배열로 초기화 (에러 방지 핵심)
        setRecentKeywords(Array.isArray(parsed) ? parsed : []);
      } else {
        setRecentKeywords([]);
      }
    } catch (e) {
      console.error("Load Error:", e);
      setRecentKeywords([]); // 에러 나면 그냥 비워버림
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKeywords();
    }, []),
  );

  // ✅ 2. 검색 및 저장 (데이터 형식 강제)
  const handleSearch = async (text: string) => {
    // text가 객체가 아닌 '문자열'인지 확실히 체크
    const word = typeof text === "string" ? text.trim() : "";
    if (!word) return;

    // 중복 제거 후 최신순 10개 (데이터는 오직 문자열 배열로만 유지)
    const updatedList = [
      word,
      ...recentKeywords.filter((v) => v !== word),
    ].slice(0, 10);

    try {
      setRecentKeywords(updatedList);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSearchQuery("");

      router.push({
        pathname: "/search/result",
        params: { q: word },
      });
    } catch (e) {
      console.error("Save Error:", e);
    }
  };

  // ✅ 3. 삭제 로직들
  const deleteItem = async (word: string) => {
    const filtered = recentKeywords.filter((v) => v !== word);
    setRecentKeywords(filtered);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  const deleteAll = async () => {
    setRecentKeywords([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const populars = [
    "비타민C",
    "단백질 쉐이크",
    "유산균",
    "오메가3",
    "마그네슘",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color="#999" size={18} />
          <TextInput
            style={styles.input}
            placeholder="궁금한 내용을 검색해보세요"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X color="#ccc" size={18} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <Clock size={16} color="#666" />
              <Text style={styles.sectionTitle}>최근 검색어</Text>
            </View>
            {recentKeywords.length > 0 && (
              <TouchableOpacity onPress={deleteAll}>
                <Text style={styles.clearBtn}>전체 삭제</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentKeywords.length > 0 ? (
            <View style={styles.badgeContainer}>
              {recentKeywords.map((word, i) => (
                <View key={`recent-${i}`} style={styles.badge}>
                  <TouchableOpacity onPress={() => handleSearch(word)}>
                    <Text style={styles.badgeText}>{String(word)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem(word)}>
                    <X size={12} color="#999" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>최근 검색어가 없습니다.</Text>
          )}
        </View>

        <View style={styles.lineDivider} />

        <View style={styles.section}>
          <View style={[styles.row, { marginBottom: 15 }]}>
            <TrendingUp size={16} color="#007AFF" />
            <Text style={styles.sectionTitle}>인기 검색어</Text>
          </View>
          {populars.map((word, i) => (
            <TouchableOpacity
              key={`pop-${i}`}
              style={styles.rankItem}
              onPress={() => handleSearch(word)}
            >
              <Text style={styles.rankNum}>{i + 1}</Text>
              <Text style={styles.rankText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "android" ? 40 : 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginLeft: 10,
    height: 40,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  scrollBody: { padding: 20 },
  section: { marginBottom: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  row: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginLeft: 6 },
  clearBtn: { color: "#999", fontSize: 13 },
  badgeContainer: { flexDirection: "row", flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 10,
  },
  badgeText: { fontSize: 14, color: "#555" },
  emptyText: { color: "#bbb", textAlign: "center", marginTop: 10 },
  lineDivider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f9f9f9",
  },
  rankNum: { fontSize: 15, fontWeight: "bold", color: "#007AFF", width: 25 },
  rankText: { fontSize: 15, color: "#333" },
});
