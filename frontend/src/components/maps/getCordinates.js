import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const getCoordinates = async (address) => {
  const geocodingClient = mbxGeocoding({ accessToken: process.env.REACT_APP_MAP_BOX_API_KEY });

  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
      })
      .send();

    const { features } = response.body;
    if (features.length > 0) {
      const [longitude, latitude] = features[0].geometry.coordinates;
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

const renderMapboxMap = (location) => {
  const locationName = location[0].locationName
  const longitude = location[0].longitude.toString()
  const latitude = location[0].latitude.toString()
  const mapboxAccessToken = process.env.REACT_APP_MAP_BOX_API_KEY;
  const mapboxUrl = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`;

  const customMarkerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  if (!longitude || !latitude) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          url={mapboxUrl}
          id='mapbox/streets-v11'
          tileSize={512}
          zoomOffset={-1}
          accessToken={mapboxAccessToken}
        />
        <Marker position={[latitude, longitude]} icon={customMarkerIcon}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export { getCoordinates, renderMapboxMap }