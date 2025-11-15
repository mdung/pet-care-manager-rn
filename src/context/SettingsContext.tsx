import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings } from '@/types/settings';
import { settingsStorage } from '@/services/storage/settingsStorage';

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    defaultCurrency: 'USD',
    defaultReminderTime: '09:00',
    notificationsEnabled: true,
  });
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const currentSettings = await settingsStorage.get();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error refreshing settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    await settingsStorage.save(updatedSettings);
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

