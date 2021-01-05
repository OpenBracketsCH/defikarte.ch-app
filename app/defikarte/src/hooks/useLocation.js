import {useState, useEffect} from 'react';
import * as Location from "expo-location";

export default () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState({
    latitude: 47,
    longitude: 7.4,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          // latitudeDelta: 0.45,
          // longitudeDelta: 0.45,
        });
      } catch (err) {
        console.log({ err });
        setErrorMsg({err})
      }
    })();
  });

  return [location, errorMsg]
}