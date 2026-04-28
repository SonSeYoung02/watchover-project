import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Heart, Bookmark, MessageCircle } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyPostList, getMyCommentList } from "../../api/communityApi";

export default function UserActivityPage() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("posts");
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (tab === "posts") {
        const result = await getMyPostList(token);
        const list = result?.data?.listPost || [];
        setMyPosts(list);
      } else {
        const result = await getMyCommentList(token);
        const list = result?.data?.listComment || [];
        setMyComments(list);
      }
    } catch (error) {
      console.error("나의 활동 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

  const getCommentCount = (item) =>
    item.commentCount ?? item.commentCnt ?? item.replyCount ?? 0;

  const renderPostItem = ({ item }) => {
    const commentCount = getCommentCount(item);
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
        activeOpacity={0.85}
      >
        <View style={styles.titleRow}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {!!item.content && (
          <Text style={styles.postContentPreview} numberOfLines={1}>
            {item.content}
          </Text>
        )}

        <View style={styles.postFooterRow}>
          <Text style={styles.authorMeta}>{formatDate(item.createdAt)}</Text>
          <View style={styles.postStatsGroup}>
            <View style={styles.statItem}>
              <Heart size={13} color="#FF5A5F" />
              <Text style={styles.statText}>{item.likeCount || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={13} color="#5AA9E6" />
              <Text style={styles.statText}>{commentCount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCommentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
      activeOpacity={0.85}
    >
      <Text style={styles.originPostText} numberOfLines={1}>
        게시글 #{item.postId}
      </Text>
      <Text style={styles.commentContentText} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.authorMeta}>{formatDate(item.createdAt)}</Text>
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
        <Text style={styles.headerTitle}>나의 활동</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "posts" && styles.activeTabBtn]}
          onPress={() => setActiveTab("posts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.activeTabText,
            ]}
          >
            작성한 글
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === "comments" && styles.activeTabBtn,
          ]}
          onPress={() => setActiveTab("comments")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "comments" && styles.activeTabText,
            ]}
          >
            작성한 댓글
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5AA9E6" />
        </View>
      ) : (
        <FlatList
          data={activeTab === "posts" ? myPosts : myComments}
          renderItem={activeTab === "posts" ? renderPostItem : renderCommentItem}
          keyExtractor={(item) =>
            activeTab === "posts"
              ? item.postId.toString()
              : item.commentId.toString()
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === "posts"
                  ? "작성한 글이 없습니다."
                  : "작성한 댓글이 없습니다."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    backgroundColor: "#ffffff",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  backBtn: { width: 40, alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },
  headerRight: { width: 40 },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabBtn: { borderBottomColor: "#5AA9E6" },
  tabText: { fontSize: 14, color: "#aaaaaa", fontWeight: "500" },
  activeTabText: { color: "#5AA9E6", fontWeight: "700" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingHorizontal: 0, paddingBottom: 40, paddingTop: 0 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#999", fontSize: 15 },

  postItem: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 3,
  },
  postContentPreview: {
    fontSize: 13,
    color: "#999999",
    lineHeight: 18,
    marginBottom: 8,
  },
  postFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorMeta: { fontSize: 12, color: "#bbbbbb" },
  postStatsGroup: { flexDirection: "row", gap: 10 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  statText: { fontSize: 12, color: "#aaaaaa" },

  originPostText: {
    fontSize: 12,
    color: "#aaaaaa",
    marginBottom: 6,
  },
  commentContentText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 8,
  },
});
