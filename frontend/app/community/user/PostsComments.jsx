import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Heart, Bookmark } from "lucide-react-native";
import React, { useState } from "react";
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

export default function UserActivityPage() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("posts");

  // 샘플 데이터 유지
  const myPosts = [
    {
      id: "1",
      title: "리액트 네이티브 너무 재밌네요!",
      views: 125,
      likes: 15,
      bookmarks: 5,
      commentCount: 2,
      date: "2026.03.27",
    },
    {
      id: "2",
      title: "Expo에서 안드로이드 에뮬레이터 설정법",
      views: 420,
      likes: 32,
      bookmarks: 12,
      commentCount: 8,
      date: "2026.03.20",
    },
  ];

  const myComments = [
    {
      id: "c1",
      postId: "1",
      content:
        "공감합니다! UI 만드는 재미가 확실하죠. 특히 애니메이션 넣을 때가 제일 짜릿해요.",
      postTitle: "리액트 네이티브 너무 재밌네요!",
      likes: 3,
      date: "15분 전",
    },
    {
      id: "c2",
      postId: "105",
      content: "저도 이거 궁금했는데 해결됐어요! 감사합니다.",
      postTitle: "비타민C 부족 증상 정리",
      likes: 1,
      date: "2시간 전",
    },
  ];

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.titleRow}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.commentCount > 0 && (
          <Text style={styles.commentBadge}>[{item.commentCount}]</Text>
        )}
      </View>

      <View style={styles.postFooterRow}>
        <Text style={styles.authorMeta}>{item.date}</Text>
        <View style={styles.postStatsGroup}>
          <View style={styles.statItem}>
            <Heart size={13} color="#FF5A5F" />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Bookmark size={13} color="#5AA9E6" />
            <Text style={styles.statText}>{item.bookmarks}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCommentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
      activeOpacity={0.85}
    >
      <Text style={styles.originPostText} numberOfLines={1}>
        {item.postTitle}
      </Text>
      <Text style={styles.commentContentText} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.authorMeta}>{item.date}</Text>
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

      <FlatList
        data={activeTab === "posts" ? myPosts : myComments}
        renderItem={activeTab === "posts" ? renderPostItem : renderCommentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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

  listContent: { paddingHorizontal: 0, paddingBottom: 40, paddingTop: 0 },

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
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    flex: 1,
  },
  commentBadge: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5AA9E6",
    marginLeft: 4,
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
