import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const liveUrl = 'https://apprunmate-preview.tuone000.chatgpt.site/?mode=live';

function canOpenInApp(address: string) {
  try {
    const url = new URL(address);
    if (url.protocol !== 'https:') return false;
    return url.origin === new URL(liveUrl).origin
      || url.hostname === 'chatgpt.com'
      || url.hostname.endsWith('.chatgpt.com')
      || url.hostname === 'auth.openai.com'
      || url.hostname === 'auth0.openai.com';
  } catch {
    return false;
  }
}

export function LiveRunners() {
  const browser = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [externalError, setExternalError] = useState(false);

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack || !browser.current) return false;
      browser.current.goBack();
      return true;
    });
    return () => listener.remove();
  }, [canGoBack]);

  function retry() {
    setError('');
    setCanGoBack(false);
    setExternalError(false);
    setAttempt(current => current + 1);
  }

  async function openBrowser() {
    try {
      await Linking.openURL(liveUrl);
    } catch {
      setExternalError(true);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.bar}>
        <Text style={styles.heading}>Live runners</Text>
        <Pressable accessibilityRole="link" onPress={openBrowser} style={styles.link}>
          <Text style={styles.linkText}>Open in browser ↗</Text>
        </Pressable>
      </View>
      {externalError && <Text style={styles.note} selectable>Open {liveUrl} in your browser.</Text>}
      {error ? (
        <View style={styles.status}>
          <Text accessibilityRole="alert" style={styles.note}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={styles.link}>
            <Text style={styles.linkText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={attempt}
          ref={browser}
          style={styles.web}
          source={{ uri: liveUrl }}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={request => {
            if (canOpenInApp(request.url) || request.url === 'about:blank') return true;
            setError('Continue in your browser to use this sign-in provider.');
            return false;
          }}
          onOpenWindow={() => setError('Continue in your browser to finish signing in.')}
          onNavigationStateChange={state => setCanGoBack(state.canGoBack)}
          onError={() => setError('Live runners could not load. Check your connection and try again.')}
          mixedContentMode="never"
          allowFileAccess={false}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={styles.loading} color="#174f3c" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f8ef' },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: '#17372e' },
  link: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  linkText: { color: '#15553c', fontWeight: '700', textDecorationLine: 'underline' },
  status: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  note: { color: '#263c33', fontSize: 16, textAlign: 'center' },
  web: { flex: 1 },
  loading: { ...StyleSheet.absoluteFillObject },
});
