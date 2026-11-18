module.exports = {
  expo: {
    name: 'AppRunmate', slug: 'apprunmate', scheme: 'apprunmate',
    version: '0.1.0', orientation: 'portrait', userInterfaceStyle: 'light',
    ios: { supportsTablet: true, bundleIdentifier: 'com.tiisetsotuwani.apprunmate' },
    android: { package: 'com.tiisetsotuwani.apprunmate' },
    plugins: ['expo-dev-client'],
    ...(process.env.EXPO_OWNER ? { owner: process.env.EXPO_OWNER } : {}),
    extra: { demoMode: true, ...(process.env.EAS_PROJECT_ID ? {eas: {projectId: process.env.EAS_PROJECT_ID}} : {}) }
  }
};
