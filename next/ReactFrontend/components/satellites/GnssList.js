import GnssItem from './GnssItem';
import classes from './GnssList.module.css';


function GnssList(props) {
    return (
        <ul className={classes.list}>
            {props.gnssSatellites && props.gnssSatellites.length > 0 ? (
                props.gnssSatellites.map((satellite) => (
                    <GnssItem
                    key={satellite.satelliteId || satellite.name}
                    id={satellite.id || satellite.name}
                    type={satellite.type}
                    country={satellite.country}
                    />
                ))
            ):(
                <p>No GNSS Satellites Found</p>
            )}
        </ul>
    )
}

export default GnssList