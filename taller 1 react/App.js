import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { AppState, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import * as Localization from 'expo-localization';

export default function App() {
  const getDeviceLocale = () => {
    const locales = typeof Localization.getLocales === 'function'
      ? Localization.getLocales()
      : [];
    const languageTag = locales[0]?.languageTag;
    return (languageTag || Localization.locale || 'es').toLowerCase();
  };

  const [locale, setLocale] = useState(getDeviceLocale);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isEnglish = locale.startsWith('en');

  useEffect(() => {
    const handleLocaleChange = () => {
      setLocale((current) => {
        const next = getDeviceLocale();
        return current === next ? current : next;
      });
    };

    const localizationSubscription =
      Localization.addLocalizationListener?.(handleLocaleChange);
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        handleLocaleChange();
      }
    });
    const intervalId = setInterval(handleLocaleChange, 1500);

    return () => {
      appStateSubscription.remove();
      clearInterval(intervalId);
      if (localizationSubscription && typeof localizationSubscription.remove === 'function') {
        localizationSubscription.remove();
      } else if (typeof Localization.removeLocalizationListener === 'function') {
        Localization.removeLocalizationListener(handleLocaleChange);
      }
    };
  }, []);

  const theme = useMemo(() => {
    if (isLandscape && isEnglish) {
      return {
        background: '#6CB3A2',
        card: '#8EC4B8',
        text: '#F0A22E',
        message: 'Texto D',
        statusBar: 'dark',
      };
    }

    if (isLandscape && !isEnglish) {
      return {
        background: '#4A0BA0',
        card: '#6C3CC0',
        text: '#0B0B0B',
        message: 'Texto C',
        statusBar: 'light',
      };
    }

    if (!isLandscape && isEnglish) {
      return {
        background: '#273C08',
        card: '#3A4B16',
        text: '#F3F3F3',
        message: 'Texto B',
        statusBar: 'light',
      };
    }

    return {
      background: '#1B39D9',
      card: '#2E4AE1',
      text: '#F2A3C6',
      message: 'Texto A',
      statusBar: 'light',
    };
  }, [isEnglish, isLandscape]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.text, { color: theme.text }]}>{theme.message}</Text>
      </View>
      <StatusBar style={theme.statusBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
  },
});
