import 'dotenv/config';

export default ({ config }) => {
  const googleMapsApiKey = process.env['REACT_NATIVE_GOOGLE_MAPS_API_KEY']
  if (googleMapsApiKey != null) {
    config.android.config.googleMaps.apiKey = googleMapsApiKey;
  }
  return {
    extra: {
      backendBaseUrl: process.env['REACT_NATIVE_BASE_URL'] ?? '',
      backendApiKey: process.env['REACT_NATIVE_API_KEY'] ?? '',
      eas: {
        projectId: "1d176347-a834-4c1c-92e7-c0f4637108a0",
      },
    },
    plugins: [
      "expo-localization"
    ],
    ...config,
  };
};
