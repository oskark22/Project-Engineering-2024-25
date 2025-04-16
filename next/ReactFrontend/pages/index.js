import CelestrakList from "../components/satellites/CelestrakList";
import GnssList from "../components/satellites/GnssList";
import SatelliteList from "../components/satellites/SatelliteList";
import { useState, useEffect } from "react";

function HomePage() {
  const [gnssSatellites, setGnssSatellites] = useState([]);
  const [celestrakSatellites, setCelestrakSatellites] = useState([]);

  useEffect(() => {
    fetchSatellites();
  }, []);

  async function fetchSatellites() {
    const response = await fetch("/api/get-satellites")
    let data = await response.json()
    setGnssSatellites(data.gnssSatellites || [])
    setCelestrakSatellites(data.celestrakSatellites || [])
  }

  //combine both GNSS and celestrak satellites into a single array
  //const allSatellites = [...gnssSatellites, ...celestrakSatellites]    //Use spread operator(...) to flatten the arrays
  const navigationSatellites = [gnssSatellites]
  const otherSatellites = [celestrakSatellites]

  //<SatelliteList satellites={allSatellites} />

  return (
    <div>
      <h1>Satellite Follower App</h1>
      <p>Satellites Near Galway:</p>
      <GnssList gnssSatellites={gnssSatellites} />
      <CelestrakList celestrakSatellites={celestrakSatellites} />
    </div>
  )
}

export default HomePage
