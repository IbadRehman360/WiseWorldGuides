import { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Form.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
// import Button from "./Button";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const baseUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [isGeoCodingError, setGeoCodingError] = useState();
  useEffect(() => {
    async function retriveData() {
      try {
        setIsLoadingGeoCoding(true);
        setGeoCodingError("");
        const res = await fetch(`${baseUrl}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "Invalid, doesn't seem to be a valid location, city is not found, click somewhere else..."
          );
        setCityName(data.city);
        setCountry(data.country);
        console.log(data);
      } catch (err) {
        console.log(err.message);
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    retriveData();
  }, [lat, lng]);
  if (isGeoCodingError) return <Message message={isGeoCodingError} />;
  if (isLoadingGeoCoding) return <Spinner />;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>
      <BackButton />
    </form>
  );
}

export default Form;
