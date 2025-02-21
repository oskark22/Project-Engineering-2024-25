import SatelliteItem from "./SatelliteItem";
import classes from './SatelliteList.module.css'

function SatelliteList(props) {                                 //Function takes props as an argument, which contains the satellites data passed from its parent component
    return (
      <ul className={classes.list}>                               
        {props.satellites && props.satellites.length > 0 ? (      //Ensure satellites is not undefined or empty to avoid errors
        props.satellites.map((satellite) => (                     //map() loops over the array to create one <SatelliteItem /> component per satellite
          <SatelliteItem                                          //Props passed to <SatelliteItem />
            key={satellite.satelliteId}                           //React requires a unique key for each list item to optimize re-rendering
            id={satellite.id}
            type={satellite.type}
            country={satellite.country}                           //Passes the satellite's country of origin
          />
        ))
      ) : (
        <p>No satellites found</p>      //Fallback message when no satellites are available
      )}
      </ul>
    );
  }
  
  export default SatelliteList;
  