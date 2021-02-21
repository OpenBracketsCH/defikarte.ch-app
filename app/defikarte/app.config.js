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
    },
    ...config,
  };
};
