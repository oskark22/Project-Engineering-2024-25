import CelestrakList from "../components/satellites/CelestrakList";
import GnssList from "../components/satellites/GnssList";
import { useState, useEffect } from "react";

function HomePage() {
  const [gnssSatellites, setGnssSatellites] = useState([])
  const [celestrakSatellites, setCelestrakSatellites] = useState([])

  useEffect(() => {                                                   // When the component first loads ( [] = run once), it calls fetchSatellites
    fetchSatellites()
  }, [])

  async function fetchSatellites() {
    const response = await fetch("/api/get-satellites")
    let data = await response.json()
    setGnssSatellites(data.gnssSatellites || [])                      // If the API didn't send data, it safely falls back to empty arrays (|| []).
    setCelestrakSatellites(data.celestrakSatellites || [])
  }

  const navigationSatellites = [gnssSatellites]
  const otherSatellites = [celestrakSatellites]

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
