import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Compass, Map, Binoculars, Leaf, User } from 'lucide-react-native'
import { DiscoverScreen } from '@/screens/DiscoverScreen'
import { MapScreen } from '@/screens/MapScreen'
import { ExploreScreen } from '@/screens/ExploreScreen'
import { CollectionScreen } from '@/screens/CollectionScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { SpeciesDetailScreen, TreeDetailScreen, PlaceDetailScreen } from '@/screens/DetailScreens'
import { MissionDetailScreen, AdventureGenerateScreen, AdventureScreen } from '@/screens/AdventureScreens'
import { colors, fonts } from '@/theme'
import type { MainTabParamList, RootStackParamList } from './types'

const Tab = createBottomTabNavigator<MainTabParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.cream,
    card: colors.cream,
    text: colors.charcoal,
    border: 'rgba(27,58,42,0.08)',
    primary: colors.forest,
    notification: colors.gold,
  },
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.charcoalMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(245,240,232,0.96)',
          borderTopColor: 'rgba(27,58,42,0.08)',
          height: 88,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 10,
        },
      }}
    >
      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverScreen}
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} strokeWidth={1.8} />,
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} strokeWidth={1.8} />,
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Binoculars color={color} size={size} strokeWidth={1.8} />,
        }}
      />
      <Tab.Screen
        name="CollectionTab"
        component={CollectionScreen}
        options={{
          title: 'Collection',
          tabBarIcon: ({ color, size }) => <Leaf color={color} size={size} strokeWidth={1.8} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={1.8} />,
        }}
      />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SpeciesDetail" component={SpeciesDetailScreen} />
        <Stack.Screen name="TreeDetail" component={TreeDetailScreen} />
        <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
        <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
        <Stack.Screen name="Adventure" component={AdventureScreen} />
        <Stack.Screen name="AdventureGenerate" component={AdventureGenerateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
