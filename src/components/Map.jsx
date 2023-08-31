import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../Context/CitiesContext";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
function Map() {
  const { cities } = useCities();
  const [mapPostion, setMapPostion] = useState([40, 0]);
  const {
    isLoading: isLoadingPostion,
    position: geoLocationPostion,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (mapLat && mapLng) setMapPostion([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geoLocationPostion)
      setMapPostion([geoLocationPostion.lat, geoLocationPostion.lng]);
  }, [geoLocationPostion]);
  return (
    <div className={styles.mapContainer}>
      {!geoLocationPostion && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPostion ? "Loading..." : "Use your location"}
        </Button>
      )}
      <MapContainer
        center={mapPostion}
        className={styles.mapContainer}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              {city.name} - {city.description}
            </Popup>
          </Marker>
        ))}
        <ChangePointer position={mapPostion} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangePointer({ position }) {
  const map = useMap();
  map.setView(position);
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
