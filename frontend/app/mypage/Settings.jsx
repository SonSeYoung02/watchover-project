import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native"; // ✅ lucide-react-native 사용

const Settings = () => {
  const router = useRouter();

  // 토글 스위치 상태 관리
  const [settings, setSettings] = useState({
    chatbot: true,
    community: true,
    nightPush: false,
    appLock: false,
    faceId: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ 커스텀 토글 스위치 컴포넌트
  const ToggleSwitch = ({ isOn, onToggle }) => (
    <TouchableOpacity
      style={[styles.toggleSwitch, isOn ? styles.toggleOn : styles.toggleOff]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View
        style={[styles.toggleHandle, isOn ? styles.handleOn : styles.handleOff]}
      />
      <Text
        style={[styles.toggleLabel, isOn ? styles.labelOn : styles.labelOff]}
      >
        {isOn ? "ON" : "OFF"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.settingsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. 알림 설정 섹션 */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>챗봇 알림</Text>
              <Text style={styles.itemSub}>
                알림을 끄면 챗봇의 대화 알림이 오지 않아요.
              </Text>
            </View>
            <ToggleSwitch
              isOn={settings.chatbot}
              onToggle={() => toggleSetting("chatbot")}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>커뮤니티 알림</Text>
              <Text style={styles.itemSub}>
                커뮤니티 게시글에 대한 알림을 받을 수 있어요.
              </Text>
            </View>
            <ToggleSwitch
              isOn={settings.community}
              onToggle={() => toggleSetting("community")}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingText}>
              <Text style={styles.itemLabel}>야간 푸시 알림</Text>
              <Text style={styles.itemSub}>
                저녁 9시 이후에도 혜택 소식을 받을 수 있어요.
              </Text>
            </View>
            <ToggleSwitch
              isOn={settings.nightPush}
              onToggle={() => toggleSetting("nightPush")}
            />
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* 3. 잠금 설정 섹션 */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>잠금 설정</Text>

          <View style={[styles.settingItem, styles.simpleItem]}>
            <Text style={styles.itemLabel}>앱 잠금</Text>
            <ToggleSwitch
              isOn={settings.appLock}
              onToggle={() => toggleSetting("appLock")}
            />
          </View>

          <View style={[styles.settingItem, styles.simpleItem]}>
            <Text style={styles.itemLabel}>Face ID</Text>
            <ToggleSwitch
              isOn={settings.faceId}
              onToggle={() => toggleSetting("faceId")}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, styles.simpleItem]}
            onPress={() => router.push("/settings/password")}
          >
            <Text style={styles.itemLabel}>비밀번호 변경</Text>
            <ChevronRight size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionDivider} />

        {/* 4. 하단 메뉴 섹션 */}
        <View style={[styles.settingsSection, { paddingBottom: 40 }]}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>캐시 삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },
  backBtn: { padding: 4 },

  settingsContent: { flex: 1 },
  settingsSection: {
    padding: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 20,
    color: "#000",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  simpleItem: {
    marginBottom: 24,
  },
  settingText: { flex: 1, marginRight: 10 },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  itemSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  // ✅ 토글 스위치 스타일
  toggleSwitch: {
    width: 54,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: "#FFE45E" }, // 사진 속 시그니처 노란색
  toggleOff: { backgroundColor: "#cccccc" },
  toggleHandle: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 9,
    position: "absolute",
  },
  handleOn: { right: 5 },
  handleOff: { left: 5 },
  toggleLabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#fff",
    position: "absolute",
  },
  labelOn: { left: 8 },
  labelOff: { right: 8 },

  sectionDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 0,
  },
  menuItem: {
    marginBottom: 25,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
