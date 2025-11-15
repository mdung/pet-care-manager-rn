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
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Currency } from '@/types/settings';
import { ThemeMode } from '@/types/theme';
import { CURRENCY_SYMBOLS } from '@/utils/constants';
import { backupService } from '@/services/backup/backupService';
import { useI18n } from '@/context/I18nContext';
import { Language } from '@/types/i18n';
import Toast from 'react-native-toast-message';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings } = useSettings();
  const { theme, isDark, setThemeMode } = useTheme();
  const { language, setLanguage: setI18nLanguage } = useI18n();

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
          <Text style={styles.sectionTitle}>Language</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Language</Text>
              <Text style={styles.settingDescription}>
                Choose your preferred language
              </Text>
            </View>
            <View style={styles.languageOptions}>
              {(['en', 'es', 'fr'] as Language[]).map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    language === lang && styles.languageButtonSelected,
                  ]}
                  onPress={() => setI18nLanguage(lang)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      language === lang && styles.languageButtonTextSelected,
                    ]}
                  >
                    {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>
                Choose light, dark, or system theme
              </Text>
            </View>
            <View style={styles.themeOptions}>
              {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeButton,
                    theme.mode === mode && styles.themeButtonSelected,
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      theme.mode === mode && styles.themeButtonTextSelected,
                    ]}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

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
          <Text style={styles.sectionTitle}>Backup & Restore</Text>
          
          <Button
            title="Create Backup"
            onPress={async () => {
              try {
                const fileUri = await backupService.createBackup();
                await backupService.shareBackup(fileUri);
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Backup created and shared',
                });
              } catch (error) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Failed to create backup',
                });
              }
            }}
            style={styles.backupButton}
          />

          <Button
            title="Export Data"
            onPress={() => navigation.navigate('Export' as never)}
            variant="secondary"
            style={styles.backupButton}
          />
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
  themeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  themeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  themeButtonText: {
    fontSize: 14,
    color: '#000',
  },
  themeButtonTextSelected: {
    color: '#fff',
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  languageButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#000',
  },
  languageButtonTextSelected: {
    color: '#fff',
  },
  backupButton: {
    marginBottom: 12,
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

