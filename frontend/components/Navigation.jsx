import { useNavigation, useNavigationState } from '@react-navigation/native';
import {
  Calendar,
  MessageCircle,
  Smile,
  User,
  Users,
} from 'lucide-react-native';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Navigation = () => {
  const navigation = useNavigation();
  const currentRoute = useNavigationState(
    (state) => state?.routes[state.index]?.name ?? '',
  );

  const menuItems = [
    { screen: 'AiChat', icon: MessageCircle, label: 'AI 채팅' },
    { screen: 'Calendar', icon: Calendar, label: '달력' },
    { screen: 'Community', icon: Users, label: '커뮤니티' },
    { screen: 'Character', icon: Smile, label: '캐릭터' },
    { screen: 'Mypage', icon: User, label: '내 정보' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.bottomNav}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentRoute === item.screen;

          return (
            <TouchableOpacity
              key={item.screen}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.6}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <IconComponent size={24} color={isActive ? '#5AA9E6' : '#AAAAAA'} />
              </View>
              <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: { elevation: 16 },
    }),
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EEF4',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 48,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#EAF4FD',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#AAAAAA',
    marginTop: 3,
  },
  activeLabel: {
    color: '#5AA9E6',
    fontWeight: '700',
  },
});
