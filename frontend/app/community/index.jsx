import { useFocusEffect, useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageSquareText,
  Search,
  SquarePen,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ 상세 페이지의 실시간 데이터 참조
import * as PostData from "./post/[post]";

// 전역 상태 관리 (북마크)
export let globalBookmarkState: { [key: string]: boolean } = {
  "1": true,
  "3": true,
};

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("전체글");
  const tabs = ["전체글", "인기글", "북마크"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 게시글 초기 데이터
  const [posts, setPosts] = useState([
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      title:
        i === 0
          ? "리액트 네이티브 너무 재밌네요!"
          : `게시글 ${i + 1}번 제목입니다.`,
      author: i === 0 ? "코딩왕" : `작성자${i + 1}`,
      views: 124 + i,
      likes: i === 0 ? 15 : i > 15 ? 20 : 5,
      bookmarks: 5,
      commentCount: 2,
      createdAt: "2026.03.27",
    })),
  ]);

  // ✅ 화면에 포커스될 때마다 상세 페이지에서 변경된 수치(좋아요, 조회수, 댓글, 북마크) 반영
  useFocusEffect(
    useCallback(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          const realLikes =
            PostData.globalLikeCountState?.[post.id] ?? post.likes;
          const realViews =
            PostData.globalViewCountState?.[post.id] ?? post.views;

          // 댓글 개수 반영
          const realComments =
            PostData.globalCommentCountState?.[post.id] ??
            (PostData.globalCommentStore?.[post.id]
              ? PostData.globalCommentStore[post.id].length
              : post.commentCount);

          return {
            ...post,
            likes: realLikes,
            views: realViews,
            commentCount: realComments,
            isBookmarked: !!globalBookmarkState[post.id],
            // 북마크 활성화 시 UI상으로 숫자 +1 효과
            displayBookmarks: globalBookmarkState[post.id]
              ? post.bookmarks + 1
              : post.bookmarks,
          };
        }),
      );
    }, []),
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // 탭 필터링
  const filteredPosts = useMemo(() => {
    if (activeTab === "인기글") return posts.filter((p) => p.likes >= 10);
    if (activeTab === "북마크")
      return posts.filter((p) => globalBookmarkState[p.id]);
    return posts;
  }, [activeTab, posts]);

  // 페이지네이션 슬라이싱
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredPosts]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <View style={styles.postInfoContainer}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.postAuthor}>{item.author}</Text>
        <View style={styles.postStatsRow}>
          <Text style={styles.postStatText}>
            조회 {item.views} | 추천 {item.likes} | 북마크{" "}
            {item.displayBookmarks ?? item.bookmarks} | {item.createdAt}
          </Text>
        </View>
      </View>
      <View style={styles.commentCountContainer}>
        <MessageSquareText size={14} color="#666" />
        <Text style={styles.commentCountText}>{item.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    let pages = [];
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

      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerLeft}
        >
          <ChevronLeft color="black" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>커뮤니티</Text>
        <View style={styles.headerRight}>
          {/* 검색 버튼 */}
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Search color="black" size={24} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          {/* ✅ 검색 오른쪽 아이콘: 나의 활동 페이지로 이동 */}
          <TouchableOpacity onPress={() => router.push("/user/activity")}>
            <ClipboardList color="black" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 탭 영역 */}
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

      <FlatList
        data={currentData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

      {/* 글쓰기 FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/write")}
      >
        <SquarePen color="black" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: { position: "absolute", left: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerRight: {
    flexDirection: "row",
    position: "absolute",
    right: 16,
    alignItems: "center",
  },
  topTabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: { borderBottomColor: "#000" },
  topTabItem: { fontSize: 15, color: "#999", fontWeight: "500" },
  activeTabText: { color: "#000", fontWeight: "bold" },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  postItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
  },
  postInfoContainer: { flex: 1, paddingRight: 10 },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  postAuthor: { fontSize: 13, color: "#666", marginBottom: 6 },
  postStatsRow: { flexDirection: "row", alignItems: "center" },
  postStatText: { fontSize: 11, color: "#aaa" },
  commentCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 45,
    justifyContent: "center",
  },
  commentCountText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
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
    borderRadius: 4,
  },
  activePageBtn: { backgroundColor: "#000" },
  pageText: { fontSize: 15, color: "#666" },
  activePageText: { color: "#fff", fontWeight: "bold" },
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
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
