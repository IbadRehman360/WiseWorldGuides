import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer}>
      <h1>MAP </h1>
      <h2>
        Postion: {lat},{lng}{" "}
      </h2>
    </div>
  );
}

export default Map;
