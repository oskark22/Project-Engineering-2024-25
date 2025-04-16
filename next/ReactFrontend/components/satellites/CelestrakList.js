import CelestrakItem from './CelestrakItem';
import classes from './CelestrakList.module.css';


function CelestrakList(props) {
    return (
        <ul className={classes.list}>
            {props.celestrakSatellites && props.celestrakSatellites.length > 0 ? (
                props.celestrakSatellites.map((satellite) => (
                    <CelestrakItem
                    key={satellite.satelliteId || satellite.name}
                    id={satellite.id || satellite.name}
                    latitude={satellite.latitude}
                    longitude={satellite.longitude}
                    />
                ))
            ):(
                <p>No Satellites From Celestrak</p>
            )}
        </ul>
    )
}

export default CelestrakList