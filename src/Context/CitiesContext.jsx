import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BaseURL = "http://localhost:8000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BaseURL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        alert("Failed to fetch cities: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BaseURL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (err) {
      alert("Failed to fetch cities: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, getCity, currentCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error(
      "Cities context is undefined or not defined in the default configuration"
    );
  }
  return context;
}

export { CitiesProvider, useCities };
