import { useEffect, useState } from 'react';

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export default function useGeolocation() {
  const [location, setLocation] = useState<GeoLocation>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        err => {
          console.log(err);
          setError(err.message);
        }
      );
    } else {
      setError("Your browser doesn't support geolocation");
    }
  }, []);

  return { location, error };
}
