import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquareText,
  Search,
  SquarePen,
  Heart,
} from "lucide-react-native";
import { useCallback, useState, useRef } from "react"; // ✅ useRef 추가
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getPostList, getPopularPostList } from "../api/communityApi";

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("전체글");
  const tabs = ["전체글", "인기글", "북마크"];

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 중복 호출 방지를 위한 플래그
  const isFetching = useRef(false);

  // 🚀 게시글 로딩 함수 (깔끔하게 정리)
  const fetchPosts = useCallback(
    async (tabName) => {
      if (isFetching.current) return; // 이미 불러오는 중이면 무시
      isFetching.current = true;

      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          navigation.navigate("Login");
          return;
        }

        console.log(`📍 [${tabName}] API 호출 시작`);

        let result;
        if (tabName === "인기글") {
          result = await getPopularPostList(token);
        } else {
          result = await getPostList(token);
        }

        // ✅ 명세서 주머니 이름 'listPost'로 통일 (혹은 result 자체일 경우 대비)
        const data = result?.listPost || result?.postResponseDtoList || [];
        setPosts(data);
      } catch (error) {
        console.error(`${tabName} 로드 실패:`, error);
        if (error.response?.status === 403) {
          Alert.alert("알림", "접근 권한이 없습니다 (403).");
        }
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [navigation],
  );

  // ✅ 화면에 들어올 때 한 번만 실행되도록 관리
  useFocusEffect(
    useCallback(() => {
      fetchPosts(activeTab);
    }, [activeTab, fetchPosts]),
  );

  const handleTabChange = (tab) => {
    if (activeTab === tab) return; // 이미 선택된 탭이면 무시
    setActiveTab(tab);
    setPosts([]); // 탭 바뀔 때 이전 데이터 살짝 비워주기
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
      activeOpacity={0.7}
    >
      <View style={styles.postHeaderRow}>
        <Text style={styles.postAuthor}>{item.author || "익명"}</Text>
        <Text style={styles.postDate}>
          {item.createdAt ? item.createdAt.split("T")[0] : ""}
        </Text>
      </View>

      <Text style={styles.postTitle} numberOfLines={1}>
        {item.title}
      </Text>

      <View style={styles.postFooterRow}>
        <View style={styles.postStatsGroup}>
          <View style={styles.statItem}>
            <MessageSquareText size={14} color="#5AA9E6" />
            <Text style={[styles.statText, { color: "#5AA9E6" }]}>
              {item.commentCount || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Heart size={14} color="#FF5A5F" />
            <Text style={[styles.statText, { color: "#FF5A5F" }]}>
              {item.likeCount || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("SearchInput")}>
            <Search color="#333" size={22} style={{ marginRight: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("PostsComments")}
          >
            <ClipboardList color="#333" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.topTabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.topTabItem,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#5AA9E6" />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>게시물이 없습니다.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("PostWrite")}
      >
        <SquarePen color="#ffffff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 스타일은 원석 님 기존 코드와 동일 (깔끔함!)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backBtn: { width: 80, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    color: "#111111",
  },
  headerRight: { width: 80, flexDirection: "row", justifyContent: "flex-end" },
  topTabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: { borderBottomColor: "#5AA9E6" },
  topTabItem: { fontSize: 15, color: "#999", fontWeight: "500" },
  activeTabText: { color: "#333", fontWeight: "bold" },
  listContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 100 },
  postItem: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    elevation: 1,
  },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  postAuthor: { fontSize: 13, fontWeight: "700", color: "#111111" },
  postDate: { fontSize: 12, color: "#BBB" },
  postTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 16,
  },
  postFooterRow: { flexDirection: "row", justifyContent: "space-between" },
  postStatsGroup: { flexDirection: "row", gap: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#888" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { color: "#999", fontSize: 15 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5AA9E6",
    alignItems: "center",
    justifyContent: "center",
  },
});
