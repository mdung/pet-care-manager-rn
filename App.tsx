import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PetProvider } from '@/context/PetContext';
import { VaccineProvider } from '@/context/VaccineContext';
import { ReminderProvider } from '@/context/ReminderContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { seedData } from '@/utils/seedData';

/**
 * Pet Care Manager App
 * 
 * Architecture Notes:
 * - State Management: Using React Context API for global state management.
 *   This was chosen over Redux Toolkit because:
 *   1. Simpler setup and less boilerplate for this app size
 *   2. Built-in React solution, no additional dependencies
 *   3. Sufficient for the app's state management needs
 *   4. Easier to understand and maintain
 * 
 * - Data Persistence: AsyncStorage for local storage
 * - Navigation: React Navigation with Stack and Bottom Tabs
 * - Notifications: Expo Notifications for local reminders
 * - Forms: react-hook-form with yup validation
 * - Date Handling: dayjs for date manipulation
 */
export default function App() {
  useEffect(() => {
    // Load seed data on first launch (for demo purposes)
    seedData();
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <PetProvider>
          <VaccineProvider>
            <ReminderProvider>
              <ExpenseProvider>
                <RootNavigator />
                <StatusBar style="auto" />
              </ExpenseProvider>
            </ReminderProvider>
          </VaccineProvider>
        </PetProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

