export default ({ config }) => {
  const googleMapsApiKey = process.env['REACT_NATIVE_GOOGLE_MAPS_API_KEY']
  config.android.config.googleMaps.apiKey = googleMapsApiKey;
  return {
    ...config,
  };
};
