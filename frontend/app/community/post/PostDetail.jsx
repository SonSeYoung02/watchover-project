import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, MoreVertical, Heart, MessageCircle, Send, Bookmark, AlertTriangle, UserMinus, Mail, Edit3, Trash2 } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Modal as RNModal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPostDetail, registerComment, likePost, bookmarkPost, deletePost } from '../../api/communityApi';
import { getUserSearch } from '../../api/userApi';

export default function PostDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isBookmarkProcessing = useRef(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const userResult = await getUserSearch(token);
          if (userResult.code === 'SUCCESS') {
            setCurrentUser(userResult.data);
          }
        }
      } catch (err) {
        console.log('유저 정보 초기화 실패:', err);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        
        // 로컬에 저장된 좋아요/북마크 상태 불러오기
        const localLiked = await AsyncStorage.getItem(`liked_${id}`);
        const localBookmarked = await AsyncStorage.getItem(`bookmarked_${id}`);

        console.log('📄 상세 요청 postId:', id, '/ 타입:', typeof id);
        const result = await getPostDetail(id, token);
        console.log('📄 게시글 상세 응답:', JSON.stringify(result, null, 2));
        if (result && result.code === "SUCCESS" && result.data) {
          setPost(result.data);
          setComments(result.data.comments || result.data.commentList || []);
          setLikeCount(result.data.likeCount || 0);
          
          // 서버에서 값을 주면 서버 값을 우선하고, 없으면 로컬 상태 사용
          const serverIsLiked = result.data.isLiked !== undefined ? result.data.isLiked : result.data.isLike;
          setIsLiked(serverIsLiked !== undefined ? serverIsLiked : (localLiked === 'true'));
          
          const serverIsBookmarked = result.data.isBookmarked !== undefined ? result.data.isBookmarked : result.data.isBookmark;
          setIsBookmarked(serverIsBookmarked !== undefined ? serverIsBookmarked : (localBookmarked === 'true'));
        }
      } catch (error) {
        console.error('상세보기 로드 실패:', error);
        Alert.alert('에러', '게시글을 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPostDetail();
  }, [id]);

  const handleLikeToggle = async () => {
    if (isLikeProcessing) return;
    setIsLikeProcessing(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await likePost(id, token);
      if (result && result.code === "SUCCESS" && result.data) {
        const newIsLiked = result.data.isLike;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
        await AsyncStorage.setItem(`liked_${id}`, String(newIsLiked));
      }
    } catch (error) {
      console.error('좋아요 처리 에러:', error);
      Alert.alert('오류', '좋아요 처리에 실패했습니다.');
    } finally {
      setIsLikeProcessing(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (isBookmarkProcessing.current) return;
    isBookmarkProcessing.current = true;

    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);
    await AsyncStorage.setItem(`bookmarked_${id}`, String(newIsBookmarked));
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await bookmarkPost(id, token);
      if (result?.data?.isBookmark !== undefined) {
        const confirmed = result.data.isBookmark;
        setIsBookmarked(confirmed);
        await AsyncStorage.setItem(`bookmarked_${id}`, String(confirmed));

        // 커뮤니티 북마크 탭용 로컬 목록 동기화
        const stored = await AsyncStorage.getItem('bookmarkedPosts');
        let list = stored ? JSON.parse(stored) : [];
        if (confirmed) {
          if (post && !list.find(p => p.postId === post.postId)) {
            list.push({
              postId: post.postId,
              title: post.title,
              content: post.content,
              likeCount: post.likeCount,
              createdAt: post.createdAt,
            });
          }
        } else {
          list = list.filter(p => p.postId !== post.postId);
        }
        await AsyncStorage.setItem('bookmarkedPosts', JSON.stringify(list));
      }
    } catch (error) {
      setIsBookmarked(!newIsBookmarked);
      await AsyncStorage.setItem(`bookmarked_${id}`, String(!newIsBookmarked));
      console.error('북마크 처리 에러:', error);
      Alert.alert('오류', '북마크 처리에 실패했습니다.');
    } finally {
      isBookmarkProcessing.current = false;
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await registerComment(id, commentText, token);
      if (result && result.code === "SUCCESS") {
        setComments([...comments, result.data]);
        setCommentText('');
      }
    } catch (error) {
      Alert.alert('실패', '댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = () => {
    console.log('🗑️ 삭제 버튼 클릭됨');
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    const targetId = post?.postId || id;
    console.log(`🚀 삭제 시도 - postId: ${targetId}, 타입: ${typeof targetId}`);
    
    try {
      const token = await AsyncStorage.getItem("userToken");
      const result = await deletePost(targetId, token);
      
      console.log('✅ 삭제 응답:', JSON.stringify(result, null, 2));
      
      if (result && (result.code === "SUCCESS" || result.status === 200)) {
        Alert.alert("성공", "게시물이 삭제되었습니다.");
        navigation.goBack();
      } else {
        throw new Error(result?.message || '삭제 요청이 거부되었습니다.');
      }
    } catch (error) {
      console.error("❌ 삭제 실패 상세:", error);
      const errorMsg = error.response?.data?.message || error.message;
      const status = error.response?.status;
      
      if (status === 403) {
        Alert.alert("권한 오류", "본인이 작성한 글만 삭제할 수 있습니다.");
      } else if (status === 404) {
        Alert.alert("오류", "존재하지 않는 게시물입니다.");
      } else {
        Alert.alert("삭제 실패", `오류: ${errorMsg}`);
      }
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    navigation.navigate("PostWrite", { editPost: post });
  };

  const handleMockAction = (action) => {
    setShowMenu(false);
    Alert.alert("알림", `${action} 기능은 준비 중입니다.`);
  };

  const isAuthor = post && currentUser && post.authorNickname === currentUser.nickname;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#5AA9E6" />
      </View>
    );
  }

  if (!post) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color="#333" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowMenu(true)}>
          <MoreVertical color="#333" size={24} />
        </TouchableOpacity>
      </View>

      {/* Everytime Style Delete Confirmation Modal */}
      <RNModal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>글을 삭제하시겠습니까?</Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.confirmBtn]} 
                onPress={confirmDelete}
              >
                <Text style={styles.confirmBtnText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
      {showMenu && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity 
            style={styles.menuOverlay} 
            activeOpacity={1} 
            onPress={() => setShowMenu(false)} 
          />
          <View style={styles.menuPopup}>
            {isAuthor ? (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                  <Edit3 size={18} color="#444" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>게시글 수정</Text>
                </TouchableOpacity>
                <View style={styles.menuSeparator} />
                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                  <Trash2 size={18} color="#FF3B30" style={styles.menuIcon} />
                  <Text style={[styles.menuItemText, { color: '#FF3B30' }]}>게시글 삭제</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleMockAction('쪽지')}>
                  <Mail size={18} color="#444" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>쪽지 보내기</Text>
                </TouchableOpacity>
                <View style={styles.menuSeparator} />
                <TouchableOpacity style={styles.menuItem} onPress={() => handleMockAction('신고')}>
                  <AlertTriangle size={18} color="#444" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>신고</Text>
                </TouchableOpacity>
                <View style={styles.menuSeparator} />
                <TouchableOpacity style={styles.menuItem} onPress={() => handleMockAction('차단')}>
                  <UserMinus size={18} color="#444" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>차단</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.postHeader}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.authorMeta}>
              {post.authorNickname || '익명'}{'  ·  '}{post.createdAt ? post.createdAt.split('T')[0] : ''}
            </Text>
          </View>


          <View style={styles.postBody}>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionBar}>
            <View style={styles.actionLeft}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleLikeToggle} activeOpacity={0.7}>
                <Heart color={isLiked ? "#FF5A5F" : "#cccccc"} fill={isLiked ? "#FF5A5F" : "transparent"} size={18} />
                <Text style={[styles.actionText, { color: isLiked ? '#FF5A5F' : '#aaaaaa' }]}>{likeCount}</Text>
              </TouchableOpacity>
              <View style={styles.actionBtn}>
                <MessageCircle color="#5AA9E6" fill="#5AA9E6" size={18} />
                <Text style={[styles.actionText, { color: '#5AA9E6' }]}>{comments.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleBookmarkToggle} activeOpacity={0.7}>
              <Bookmark color={isBookmarked ? "#FFC107" : "#cccccc"} fill={isBookmarked ? "#FFC107" : "transparent"} size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.commentSection}>
            <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
            {comments.map((comment, index) => (
              <View key={comment.commentId || index} style={styles.commentItem}>
                <View style={styles.commentAuthorRow}>
                  <Text style={styles.commentAuthor}>{comment.nickname || '익명'}</Text>
                  <Text style={styles.commentTime}>{comment.createdAt ? comment.createdAt.split('T')[0] : '방금 전'}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content || comment.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="따뜻한 댓글을 남겨주세요..."
            placeholderTextColor="#bbbbbb"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleCommentSubmit}>
            <Send color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  keyboardView: { flex: 1 },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111111' },
  iconBtn: { padding: 4 },
  scrollContent: { paddingBottom: 40 },

  postHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16 },
  postTitle: { fontSize: 18, fontWeight: '800', color: '#111111', marginBottom: 8, lineHeight: 26 },
  authorMeta: { fontSize: 12, color: '#bbbbbb' },

  divider: { height: 1, backgroundColor: '#eeeeee' },

  postBody: { paddingHorizontal: 16, paddingVertical: 20 },
  postContent: { fontSize: 15, color: '#333333', lineHeight: 24 },

  actionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  actionLeft: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, color: '#aaaaaa' },

  commentSection: { paddingHorizontal: 16, paddingTop: 16 },
  commentHeader: { fontSize: 14, fontWeight: '700', color: '#333333', marginBottom: 12 },
  commentItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentAuthorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { fontSize: 13, fontWeight: '700', color: '#333333' },
  commentTime: { fontSize: 11, color: '#cccccc' },
  commentText: { fontSize: 14, color: '#555555', lineHeight: 20 },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1, backgroundColor: '#F8F9FA', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#333333', maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#5AA9E6',
    justifyContent: 'center', alignItems: 'center', marginLeft: 12,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuPopup: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 90,
    right: 16,
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 9999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  menuSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F3F5',
  },
  confirmBtn: {
    backgroundColor: '#FF5A5F',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#868E96',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
