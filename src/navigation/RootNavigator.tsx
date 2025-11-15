import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { PetFormScreen } from '@/screens/pets/PetFormScreen';
import { PetDetailScreen } from '@/screens/pets/PetDetailScreen';
import { VaccineListScreen } from '@/screens/vaccines/VaccineListScreen';
import { VaccineFormScreen } from '@/screens/vaccines/VaccineFormScreen';
import { ReminderListScreen } from '@/screens/reminders/ReminderListScreen';
import { ReminderFormScreen } from '@/screens/reminders/ReminderFormScreen';
import { ExpenseFormScreen } from '@/screens/expenses/ExpenseFormScreen';
import { ExpenseSummaryScreen } from '@/screens/expenses/ExpenseSummaryScreen';
import { ExportScreen } from '@/screens/expenses/ExportScreen';
import { WeightTrackingScreen } from '@/screens/pets/WeightTrackingScreen';
import { HealthDashboardScreen } from '@/screens/health/HealthDashboardScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PetForm"
          component={PetFormScreen}
          options={{ title: 'Add/Edit Pet' }}
        />
        <Stack.Screen
          name="PetDetail"
          component={PetDetailScreen}
          options={{ title: 'Pet Details' }}
        />
        <Stack.Screen
          name="VaccineList"
          component={VaccineListScreen}
          options={{ title: 'Vaccines' }}
        />
        <Stack.Screen
          name="VaccineForm"
          component={VaccineFormScreen}
          options={{ title: 'Add/Edit Vaccine' }}
        />
        <Stack.Screen
          name="ReminderList"
          component={ReminderListScreen}
          options={{ title: 'Reminders' }}
        />
        <Stack.Screen
          name="ReminderForm"
          component={ReminderFormScreen}
          options={{ title: 'Add/Edit Reminder' }}
        />
        <Stack.Screen
          name="ExpenseForm"
          component={ExpenseFormScreen}
          options={{ title: 'Add/Edit Expense' }}
        />
        <Stack.Screen
          name="ExpenseSummary"
          component={ExpenseSummaryScreen}
          options={{ title: 'Expense Summary' }}
        />
        <Stack.Screen
          name="Export"
          component={ExportScreen}
          options={{ title: 'Export Data' }}
        />
        <Stack.Screen
          name="WeightTracking"
          component={WeightTrackingScreen}
          options={{ title: 'Weight Tracking' }}
        />
        <Stack.Screen
          name="HealthDashboard"
          component={HealthDashboardScreen}
          options={{ title: 'Health Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

