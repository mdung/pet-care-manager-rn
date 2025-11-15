import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/Card';
import { Currency } from '@/types/settings';
import { CURRENCY_SYMBOLS } from '@/utils/constants';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const handleCurrencyChange = (currency: Currency) => {
    updateSettings({ defaultCurrency: currency });
  };

  const handleReminderTimeChange = (time: string) => {
    updateSettings({ defaultReminderTime: time });
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    updateSettings({ notificationsEnabled: enabled });
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            // This would require clearing all storage
            Alert.alert('Info', 'Reset functionality would clear all data. Implementation depends on your needs.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Default Currency</Text>
              <Text style={styles.settingDescription}>
                Currency used for expense tracking
              </Text>
            </View>
            <View style={styles.currencyOptions}>
              {CURRENCIES.map(currency => (
                <TouchableOpacity
                  key={currency}
                  style={[
                    styles.currencyButton,
                    settings.defaultCurrency === currency && styles.currencyButtonSelected,
                  ]}
                  onPress={() => handleCurrencyChange(currency)}
                >
                  <Text
                    style={[
                      styles.currencyText,
                      settings.defaultCurrency === currency && styles.currencyTextSelected,
                    ]}
                  >
                    {CURRENCY_SYMBOLS[currency]} {currency}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Default Reminder Time</Text>
              <Text style={styles.settingDescription}>
                Default time for new reminders
              </Text>
            </View>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                // In a real app, you'd use a time picker
                Alert.prompt(
                  'Reminder Time',
                  'Enter time in HH:mm format (e.g., 09:00)',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'OK',
                      onPress: (time) => {
                        if (time && /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                          handleReminderTimeChange(time);
                        } else {
                          Alert.alert('Invalid Format', 'Please use HH:mm format (e.g., 09:00)');
                        }
                      },
                    },
                  ],
                  'plain-text',
                  settings.defaultReminderTime
                );
              }}
            >
              <Text style={styles.timeText}>{settings.defaultReminderTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Enable push notifications for reminders
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetData}
          >
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pet Care Manager v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  settingRow: {
    marginBottom: 24,
  },
  settingInfo: {
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  currencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  currencyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currencyText: {
    fontSize: 14,
    color: '#000',
  },
  currencyTextSelected: {
    color: '#fff',
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  dangerButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

