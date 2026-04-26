import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  ClipboardList,
  MessageCircle,
  MoreVertical,
  Search,
  SquarePen,
  Heart,
} from "lucide-react-native";
import { useCallback, useState, useRef } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
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

        if (tabName === "북마크") {
          const stored = await AsyncStorage.getItem("bookmarkedPosts");
          setPosts(stored ? JSON.parse(stored) : []);
          return;
        }

        let result;
        if (tabName === "인기글") {
          result = await getPopularPostList(token);
        } else {
          result = await getPostList(token);
        }

        const data = result?.data?.listPost || result?.listPost || [];
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



  const getCommentCount = (item) =>
    item.commentCount ?? item.commentCnt ?? item.replyCount ?? 0;

  const renderItem = ({ item }) => {
    const commentCount = getCommentCount(item);
    return (
      <View style={styles.postItem}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("PostDetail", { id: item.postId })}
          activeOpacity={0.7}
        >
          <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
          {!!item.content && (
            <Text style={styles.postContentPreview} numberOfLines={1}>
              {item.content}
            </Text>
          )}
          <View style={styles.postFooterRow}>
            <Text style={styles.authorMeta}>
              {item.nickname || item.author || "익명"}
              {"  ·  "}
              {item.createdAt ? item.createdAt.split("T")[0] : ""}
            </Text>
            <View style={styles.postStats}>
              <View style={styles.statItem}>
                <Heart size={12} color="#FF5A5F" />
                <Text style={styles.statText}>{item.likeCount || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <MessageCircle size={12} color="#5AA9E6" />
                <Text style={styles.statText}>{commentCount}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
    height: 44,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: { borderBottomColor: "#5AA9E6" },
  topTabItem: { fontSize: 14, color: "#aaaaaa", fontWeight: "500" },
  activeTabText: { color: "#5AA9E6", fontWeight: "700" },
  listContent: { paddingBottom: 100 },
  postItem: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  authorMeta: { fontSize: 11, color: "#cccccc" },
  postStats: {
    flexDirection: "row",
    gap: 10,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 2 },
  statText: { fontSize: 11, color: "#aaaaaa" },


  emptyContainer: { alignItems: "center", marginTop: 60 },
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
