import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessageSquareText } from "lucide-react-native";
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

// ✅ 경로 주의: 상대 경로가 정확한지 확인하세요
import { globalBookmarkState } from "..";
import * as PostData from "../post/[post]";

export default function SearchResultPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const query = params.q || "";

  // 초기 더미 데이터
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "리액트 네이티브 너무 재밌네요!",
      author: "코딩왕",
      views: 124,
      likes: 15,
      bookmarks: 5,
      commentCount: 2,
      createdAt: "2026.03.27",
    },
    {
      id: "2",
      title: "비타민C 부족 증상, 방치하면 위험한 이유",
      author: "닥터리",
      views: 890,
      likes: 42,
      bookmarks: 56,
      commentCount: 15,
      createdAt: "2026.03.26",
    },
    {
      id: "3",
      title: "운동 후 마시기 좋은 단백질 쉐이크 비교",
      author: "헬창인생",
      views: 2105,
      likes: 156,
      bookmarks: 89,
      commentCount: 42,
      createdAt: "2026.03.25",
    },
  ]);

  // ✅ 상세 페이지에서 돌아올 때마다 전역 상태를 확인하여 목록 업데이트
  useFocusEffect(
    useCallback(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          const realLikes =
            PostData.globalLikeCountState?.[post.id] ?? post.likes;
          const realViews =
            PostData.globalViewCountState?.[post.id] ?? post.views;
          const realComments =
            PostData.globalCommentCountState?.[post.id] ?? post.commentCount;
          const isBookmarked = globalBookmarkState[post.id] === true;

          return {
            ...post,
            likes: realLikes,
            views: realViews,
            commentCount: realComments,
            displayBookmarks: isBookmarked
              ? post.bookmarks + 1
              : post.bookmarks,
          };
        }),
      );
    }, []),
  );

  const results = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [posts, query]);

  // ✅ [수정 포인트] 경로를 /community/post/ 로 수정
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postWrapper}
      onPress={() => router.push(`/community/post/${item.id}`)}
    >
      <View style={styles.postContent}>
        <Text style={styles.postTitleText} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.postAuthorText}>{item.author}</Text>
        <View style={styles.postMetaRow}>
          <Text style={styles.metaLabel}>조회 {item.views}</Text>
          <Text style={styles.metaDivider}>|</Text>
          <Text style={styles.metaLabel}>추천 {item.likes}</Text>
          <Text style={styles.metaDivider}>|</Text>
          <Text style={styles.metaLabel}>북마크 {item.displayBookmarks}</Text>
          <Text style={styles.metaDivider}>|</Text>
          <Text style={styles.metaLabel}>{item.createdAt}</Text>
        </View>
      </View>
      <View style={styles.commentBadge}>
        <MessageSquareText size={14} color="#666" />
        <Text style={styles.commentText}>{item.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <View style={styles.inputBoxWrapper}>
          <Text style={styles.fakeInputText}>{query}</Text>
        </View>
      </View>
      <FlatList
        data={results}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          <Text style={styles.resultCountText}>
            검색 결과 {results.length}건
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === "android" ? 45 : 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  backBtn: { marginRight: 12 },
  inputBoxWrapper: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: "center",
  },
  fakeInputText: { fontSize: 16, color: "#000" },
  resultCountText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 15,
    marginTop: 10,
  },
  listPadding: { paddingHorizontal: 16, paddingBottom: 30 },
  postWrapper: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
  },
  postContent: { flex: 1, paddingRight: 10 },
  postTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  postAuthorText: { fontSize: 13, color: "#666", marginBottom: 8 },
  postMetaRow: { flexDirection: "row", alignItems: "center" },
  metaLabel: { fontSize: 11, color: "#aaa" },
  metaDivider: { fontSize: 11, color: "#eee", marginHorizontal: 4 },
  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    justifyContent: "center",
  },
  commentText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
});
