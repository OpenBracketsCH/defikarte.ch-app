module.exports = ({ config }) => {
  config.android.config.googleMaps.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  return {
    ...config,
  };
};
