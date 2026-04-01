import { useRouter } from "expo-router";
import { ChevronLeft, MessageSquareText, ThumbsUp } from "lucide-react-native";
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  // 샘플 데이터 (이동을 위해 postId 추가)
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
      postId: "1", // ✅ 원문 게시글 ID
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

  const renderPostItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postItemWrapper}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <View style={styles.postContentMain}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.postMetaRow}>
          <Text style={styles.metaText}>
            조회 {item.views} | 추천 {item.likes} | 북마크 {item.bookmarks} |{" "}
            {item.date}
          </Text>
        </View>
      </View>
      <View style={styles.commentBadge}>
        <MessageSquareText size={14} color="#666" />
        <Text style={styles.commentBadgeText}>{item.commentCount}</Text>
      </View>
    </TouchableOpacity>
  );

  // ✅ 작성한 댓글 렌더링 (전체 클릭 시 원문 이동 기능 추가)
  const renderCommentItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.commentItemWrapper}
      onPress={() => router.push(`/post/${item.postId}`)} // ✅ 원문으로 이동
      activeOpacity={0.7}
    >
      {/* 1. 원문 박스 */}
      <View style={styles.originPostBox}>
        <Text style={styles.originPostText} numberOfLines={1}>
          원문: {item.postTitle}
        </Text>
      </View>

      {/* 2. 내 댓글 내용 */}
      <Text style={styles.commentContentText}>{item.content}</Text>

      {/* 3. 하단 메타 정보 (추천 + 시간) */}
      <View style={styles.commentFooter}>
        <View style={styles.commentLikeRow}>
          <ThumbsUp size={12} color="#AEAEB2" style={{ marginRight: 4 }} />
          <Text style={styles.commentMetaText}>추천 {item.likes}</Text>
          <Text style={styles.commentMetaDivider}>·</Text>
          <Text style={styles.commentMetaText}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 여백 보정 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 활동</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 탭 메뉴 */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
    marginTop: Platform.OS === "android" ? 40 : 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },

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
  activeTabBtn: { borderBottomColor: "#000" },
  tabText: { fontSize: 15, color: "#8E8E93", fontWeight: "500" },
  activeTabText: { color: "#000", fontWeight: "700" },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // 작성한 글 스타일
  postItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  postContentMain: { flex: 1, paddingRight: 12 },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  postMetaRow: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12, color: "#AEAEB2" },
  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    minWidth: 42,
    justifyContent: "center",
  },
  commentBadgeText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
    fontWeight: "600",
  },

  // 작성한 댓글 스타일
  commentItemWrapper: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  originPostBox: {
    backgroundColor: "#F2F2F7", // 이미지와 비슷한 옅은 회색
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  originPostText: { fontSize: 11, color: "#8E8E93", fontWeight: "600" },
  commentContentText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 10,
  },
  commentFooter: { flexDirection: "row", alignItems: "center" },
  commentLikeRow: { flexDirection: "row", alignItems: "center" },
  commentMetaText: { fontSize: 12, color: "#AEAEB2" },
  commentMetaDivider: { fontSize: 12, color: "#D1D1D6", marginHorizontal: 6 },
});
