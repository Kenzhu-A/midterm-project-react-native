import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { JobFinderScreen } from '../screens/JobFinderScreen';
import { SavedJobsScreen } from '../screens/SavedJobsScreen';
import { ApplicationFormScreen } from '../screens/ApplicationFormScreen';
import { RootStackParamList, TabParamList } from '../types';
import { useApp } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  const { colors } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border, shadowOpacity: 0 },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'JobFinder') iconName = 'briefcase';
          else iconName = 'bookmark';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="JobFinder" component={JobFinderScreen} options={{ title: 'Job Board' }} />
      <Tab.Screen name="SavedJobs" component={SavedJobsScreen} options={{ title: 'Saved Jobs' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useApp();
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background }
      }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: 'Secure Application' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}