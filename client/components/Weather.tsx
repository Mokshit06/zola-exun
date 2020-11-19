import useGeolocation from 'hooks/useGeolocation';

export default function Weather() {
  const { location, error } = useGeolocation();

  return <div />;
}
