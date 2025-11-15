import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PetListScreen } from '@/screens/pets/PetListScreen';
import { ExpenseListScreen } from '@/screens/expenses/ExpenseListScreen';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { Text } from 'react-native';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Pets"
        component={PetListScreen}
        options={{
          title: 'My Pets',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🐾</Text>,
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseListScreen}
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

