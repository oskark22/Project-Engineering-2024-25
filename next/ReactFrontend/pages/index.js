import SatelliteList from "../components/satellites/SatelliteList";
import { useState, useEffect } from "react"; 

function HomePage() {
  const [gnssSatellites, setGnssSatellites] = useState([])
  const [celestrakSatellites, setCelestrakSatellites] = useState([])


  useEffect(() => {
    fetchSatellites()
  }, [])

  async function fetchSatellites() {
    const response = await fetch("/api/get-satellites")
    let data = await response.json()
    setGnssSatellites(data.gnssSatellites || [])
    setCelestrakSatellites(data.celestrakSatellites || [])
  }

  //combine both GNSS and celestrak satellites into a single array 
  const allSatellites = [...gnssSatellites, ...celestrakSatellites]    //Use spread operator(...) to flatten the arrays

  return (
    <div>
      <h1>Satellite Follower App</h1>
      <p>Satellites Near Galway:</p>
      <SatelliteList satellites={allSatellites} />
    </div>
  );
}

export default HomePage

  