import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bookmark,
  ChevronLeft,
  Eye,
  Heart,
  MoreVertical,
  Send,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
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

// ✅ [연동 핵심] 커뮤니티의 전역 북마크 상태 가져오기
import { globalBookmarkState } from "..";

// 전역 상태 객체들
export const globalLikeState = {};
export const globalLikeCountState = {};
export const globalViewCountState = {};
export const globalCommentStore = {};
export const globalCommentCountState = {};

export default function PostDetailScreen() {
  const { post: id } = useLocalSearchParams(); // 파일명이 [post]이므로 post로 받음
  const router = useRouter();

  const baseLikeCount = 15;
  const baseViewCount = 124;
  const baseBookmarkCount = 5;

  // --- 상태 관리 ---
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(!!globalBookmarkState[id]);
  const [isPostLiked, setIsPostLiked] = useState(!!globalLikeState[id]);
  const [postLikeCount, setPostLikeCount] = useState(
    globalLikeCountState[id] !== undefined
      ? globalLikeCountState[id]
      : baseLikeCount,
  );
  const [viewCount, setViewCount] = useState(
    globalViewCountState[id] || baseViewCount,
  );
  const [comments, setComments] = useState([]);

  // --- 초기 로딩 및 조회수 ---
  useEffect(() => {
    const currentViews = globalViewCountState[id] || baseViewCount;
    const newViews = currentViews + 1;
    globalViewCountState[id] = newViews;
    setViewCount(newViews);

    if (globalCommentStore[id]) {
      setComments(globalCommentStore[id]);
    } else {
      const initialComments = [
        {
          id: "c1",
          author: "에러박사",
          profilePic: "https://i.pravatar.cc/150?u=error_doc",
          content: "혹시 어떤 에러가 젤 힘들었나요?",
          createdAt: "15분 전",
        },
        {
          id: "c2",
          author: "산책러",
          profilePic: "https://i.pravatar.cc/150?u=walker",
          content: "공감합니다! UI 만드는 재미가 확실하죠.",
          createdAt: "22분 전",
        },
      ];
      globalCommentStore[id] = initialComments;
      globalCommentCountState[id] = initialComments.length;
      setComments(initialComments);
    }
  }, [id]);

  const post = {
    id: id,
    title: "리액트 네이티브 너무 재밌네요!",
    author: "코딩왕",
    content:
      "처음에는 에러가 많아서 힘들었는데, 하나씩 고쳐가니까 너무 뿌듯합니다.\n\nUI 만드는 맛이 있네요. 특히 Expo를 쓰니까 핸드폰에서 바로바로 확인되는 게 정말 편한 것 같아요. 다들 열공하세요!",
    bookmarkCount: baseBookmarkCount,
    createdAt: "2026.03.27 10:00",
  };

  const updateComments = (newComments) => {
    setComments(newComments);
    globalCommentStore[id] = newComments;
    globalCommentCountState[id] = newComments.length;
  };

  const handlePostLike = () => {
    const newState = !isPostLiked;
    setIsPostLiked(newState);
    globalLikeState[id] = newState;
    setPostLikeCount((prev) => {
      const updatedCount = newState ? prev + 1 : prev - 1;
      globalLikeCountState[id] = updatedCount;
      return updatedCount;
    });
  };

  const toggleBookmark = () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    globalBookmarkState[id] = newState;
  };

  const handlePostMore = () => {
    Alert.alert("게시글 옵션", "원하시는 작업을 선택하세요.", [
      {
        text: "수정",
        onPress: () => Alert.alert("알림", "수정 화면으로 이동합니다."),
      },
      { text: "삭제", style: "destructive", onPress: () => router.back() },
      { text: "취소", style: "cancel" },
    ]);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    if (editingCommentId) {
      const nextComments = comments.map((c) =>
        c.id === editingCommentId ? { ...c, content: commentText } : c,
      );
      updateComments(nextComments);
      setEditingCommentId(null);
    } else {
      const newComment = {
        id: `c${Date.now()}`,
        author: "나(사용자)",
        profilePic: "https://i.pravatar.cc/150?u=me",
        content: commentText,
        createdAt: "방금 전",
      };
      updateComments([...comments, newComment]);
    }
    setCommentText("");
  };

  const handleCommentMore = (commentId, currentContent) => {
    Alert.alert("댓글 옵션", "원하시는 작업을 선택하세요.", [
      {
        text: "수정",
        onPress: () => {
          setEditingCommentId(commentId);
          setCommentText(currentContent);
        },
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const nextComments = comments.filter((c) => c.id !== commentId);
          updateComments(nextComments);
        },
      },
      { text: "취소", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerLeft}
          >
            <ChevronLeft color="black" size={28} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>게시글</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.postContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{post.title}</Text>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={handlePostMore}
              >
                <MoreVertical color="#666" size={22} />
              </TouchableOpacity>
            </View>

            <View style={styles.authorRow}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=coding_king" }}
                style={styles.authorPhoto}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.authorName}>{post.author}</Text>
                <View style={styles.infoWrapper}>
                  <Text style={styles.dateText}>{post.createdAt}</Text>
                  <View style={styles.statInfoRow}>
                    <Eye size={14} color="#999" />
                    <Text style={styles.statValue}>{viewCount}</Text>
                    <Text style={styles.dotDivider}>·</Text>
                    <Bookmark
                      size={12}
                      color="#999"
                      fill={isBookmarked ? "#999" : "none"}
                    />
                    <Text style={styles.statValue}>
                      {isBookmarked
                        ? post.bookmarkCount + 1
                        : post.bookmarkCount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.contentText}>{post.content}</Text>

            <View style={styles.bottomActionRow}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={handlePostLike}
              >
                <Heart
                  size={19}
                  color={isPostLiked ? "#FF4D4D" : "#666"}
                  fill={isPostLiked ? "#FF4D4D" : "none"}
                />
                <Text
                  style={[
                    styles.actionText,
                    isPostLiked && { color: "#FF4D4D", fontWeight: "700" },
                  ]}
                >
                  추천 {postLikeCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={toggleBookmark}
              >
                <Bookmark
                  size={19}
                  color={isBookmarked ? "#FFD700" : "#666"}
                  fill={isBookmarked ? "#FFD700" : "none"}
                />
                <Text
                  style={[
                    styles.actionText,
                    isBookmarked && { color: "#FFD700", fontWeight: "700" },
                  ]}
                >
                  북마크{" "}
                  {isBookmarked ? post.bookmarkCount + 1 : post.bookmarkCount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
            {comments.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                <Image
                  source={{ uri: item.profilePic }}
                  style={styles.commentProfilePic}
                />
                <View style={styles.commentContentContainer}>
                  <View style={styles.commentInfoRow}>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.commentAuthor}>{item.author}</Text>
                        <Text style={styles.commentDateText}>
                          {item.createdAt}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.commentMoreBtn}
                      onPress={() => handleCommentMore(item.id, item.content)}
                    >
                      <MoreVertical color="#bbb" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.inlineInputWrapper}>
              {editingCommentId && (
                <View style={styles.replyingBar}>
                  <Text style={styles.replyingText}>댓글 수정 중...</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingCommentId(null);
                      setCommentText("");
                    }}
                  >
                    <X size={16} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputInnerContainer}>
                <TextInput
                  style={styles.enhancedInput}
                  placeholder="댓글 입력..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    styles.enhancedSendButton,
                    !commentText.trim() && styles.disabledSendButton,
                  ]}
                  onPress={handleSendComment}
                  disabled={!commentText.trim()}
                >
                  <Send
                    size={18}
                    color={commentText.trim() ? "#fff" : "#ccc"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    justifyContent: "center",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: "100%",
    position: "relative",
  },
  headerLeft: { position: "absolute", left: 16, zIndex: 10, padding: 4 },
  headerTitleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingBottom: 40 },
  postContainer: { padding: 20 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    marginRight: 10,
    lineHeight: 28,
  },
  moreButton: { padding: 4 },
  authorRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  authorPhoto: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  authorName: { fontSize: 15, fontWeight: "700", color: "#333" },
  infoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  dateText: { fontSize: 13, color: "#aaa" },
  statInfoRow: { flexDirection: "row", alignItems: "center" },
  statValue: { fontSize: 13, color: "#999", marginLeft: 4 },
  dotDivider: { marginHorizontal: 6, color: "#eee" },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    marginBottom: 25,
  },
  bottomActionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionItem: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionText: { marginLeft: 6, color: "#666", fontSize: 14, fontWeight: "500" },
  sectionDivider: {
    height: 10,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f3f5",
  },
  commentSection: { paddingHorizontal: 20 },
  commentHeader: { fontSize: 16, fontWeight: "bold", paddingVertical: 18 },
  commentItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  commentProfilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  commentContentContainer: { flex: 1 },
  commentInfoRow: { flexDirection: "row", justifyContent: "space-between" },
  commentAuthor: { fontSize: 14, fontWeight: "700", marginRight: 8 },
  commentDateText: { fontSize: 12, color: "#bbb", marginLeft: 8 },
  commentText: { fontSize: 14, color: "#333", marginTop: 4, lineHeight: 20 },
  commentMoreBtn: { padding: 4 },
  inlineInputWrapper: { marginTop: 20, marginBottom: 20 },
  replyingBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  replyingText: { fontSize: 13, color: "#666" },
  inputInnerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  enhancedInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 120,
  },
  enhancedSendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 2,
  },
  disabledSendButton: { backgroundColor: "#E1E1E4" },
});
