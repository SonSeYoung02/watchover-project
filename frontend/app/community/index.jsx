import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquareText,
  Search,
  SquarePen,
  Heart,
  Bookmark,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ 기존 API 함수 유지
import { getPostList } from "../api/communityApi";

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("전체글");
  const tabs = ["전체글", "인기글", "북마크"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getPostList();
      if (result && result.code === "SUCCESS" && result.data) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts]),
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeTab === "인기글")
      result = posts.filter((p) => (p.likes || 0) >= 10);
    if (activeTab === "북마크") result = posts.filter((p) => p.isBookmarked);
    return result;
  }, [activeTab, posts]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredPosts]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
      activeOpacity={0.7}
    >
      <View style={styles.postHeaderRow}>
        <Text style={styles.postAuthor}>{item.author}</Text>
        <Text style={styles.postDate}>{item.createdAt}</Text>
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
              {item.likes || 0}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Bookmark size={14} color="#FFD700" />
            <Text style={[styles.statText, { color: "#FFD700" }]}>
              {item.bookmarks || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageBtn, currentPage === i && styles.activePageBtn]}
          onPress={() => setCurrentPage(i)}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === i && styles.activePageText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>,
      );
    }
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(currentPage - 1)}
          style={styles.arrowBtn}
        >
          <ChevronLeft size={20} color={currentPage === 1 ? "#ccc" : "#333"} />
        </TouchableOpacity>
        {pages}
        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage(currentPage + 1)}
          style={styles.arrowBtn}
        >
          <ChevronRight
            size={20}
            color={currentPage === totalPages ? "#ccc" : "#333"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ Header 중앙 정렬 수정 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>

        {/* ⭐ flex: 1과 textAlign: center로 중앙 배치 */}
        <Text style={styles.headerTitle}>커뮤니티</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Search color="#333" size={22} style={{ marginRight: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity>
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
          data={currentData}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderPagination}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === "북마크"
                  ? "북마크한 게시글이 없습니다."
                  : "게시물이 없습니다."}
              </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  // ✅ 헤더 스타일 대칭 수정
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },

  // ⭐ 왼쪽 영역 너비 고정
  backBtn: {
    width: 80,
    alignItems: "flex-start",
    padding: 4,
  },

  // ⭐ 제목 중앙 정렬
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
  },

  // ⭐ 오른쪽 영역 너비 고정 (왼쪽과 대칭)
  headerRight: {
    width: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

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
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 15 },
  postItem: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: { elevation: 1 },
    }),
  },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postAuthor: { fontSize: 13, fontWeight: "700", color: "#111111" },
  postDate: { fontSize: 12, color: "#BBBBBB" },
  postTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 16,
    lineHeight: 22,
  },
  postFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postStatsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: { fontSize: 12, color: "#888888", fontWeight: "500" },
  commentCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCountText: {
    fontSize: 13,
    color: "#5AA9E6",
    marginLeft: 4,
    fontWeight: "700",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  pageBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 16,
  },
  activePageBtn: { backgroundColor: "#5AA9E6" },
  pageText: { fontSize: 15, color: "#888888" },
  activePageText: { color: "#ffffff", fontWeight: "bold" },
  arrowBtn: { padding: 5, marginHorizontal: 5 },
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
    ...Platform.select({
      ios: {
        shadowColor: "#5AA9E6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },
});
