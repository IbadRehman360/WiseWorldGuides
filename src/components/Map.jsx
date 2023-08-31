import { useNavigate, useSearchParams } from "react-router-dom";
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
function Map() {
  const { cities } = useCities();
  const [mapPostion, setMapPostion] = useState([40, 0]);
  const [searchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  const {
    isLoading: isLoadingPostion,
    position: isGetPostion,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) setMapPostion([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (!useGeolocation) return isLoadingPostion;

    setMapPostion([isGetPostion.lat, isGetPostion.lng]);
  }, [isGetPostion.lat, isGetPostion.lng, isLoadingPostion]);
  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPostion ? "Loading..." : "Use your location"}
      </Button>
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
      navigate(`form?${e.latlng.lat},${e.latlng.lng}`);
    },
  });
}
export default Map;
