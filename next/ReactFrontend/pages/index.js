// Notes:
// The database data should be loaded in the root component:
// - see _app.js
// so it should be done in the <Layout> component
// However, we'd then have to pass the data as a property down through
// the component tree . . . more prop drilling!
// So this is a temporary hack . . . means you have to visit the home page 
// in order to get the database data.
// We will fix this and provide a proper solution when we use the Contat API.

import { useState, useEffect } from "react";

function HomePage() {
    const [satellites, setSatellites] = useState([]);
  
    useEffect(() => {
      getSatelliteData();
    }, []);
  
    async function getSatelliteData() {
      const response = await fetch("/api/get-satellites");
      let data = await response.json();
      setSatellites(data.satellites);
    }
    
    return (
      <div>
        <h1>Satellite Follower App</h1> 
        <p>Satellites:</p>
        <SatelliteList satellites={satellites} />
      </div>
    );
  }
  
  export default HomePage;
  