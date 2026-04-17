import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  ChevronLeft,
  MessageSquareText,
  Heart,
  Bookmark,
} from "lucide-react-native"; // 아이콘 추가
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

import { globalBookmarkState } from "../communityState";
import * as PostData from "../post/PostDetail";

export default function SearchResultPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const query = route.params?.q || "";

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

  // ✅ 렌더링 아이템을 커뮤니티 메인 디자인(styles.postItem)으로 교체
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.id })}
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
              {item.displayBookmarks || 0}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
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
    marginTop: Platform.OS === "android" ? 30 : 0,
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
    paddingHorizontal: 4,
  },
  listPadding: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },

  // ✅ 커뮤니티 메인에서 가져온 카드 디자인 스타일
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
});
