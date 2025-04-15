import classes from "./SatelliteItem.module.css";

function SatelliteItem(props) {
  return (
    <li className={classes.item}>
      <div className={classes.content}>
        <h2>
          {props.id} <span className={classes.satId}>(SatID)</span>
        </h2>
        <h3>{props.type}</h3>
        <h4>{props.country}</h4>
        {props.latitude && (
          <h5 className={classes.coordinateWrapper}>
            {props.latitude} <span className={classes.lat}>(Latitude)</span>
          </h5>
        )}
        {props.longitude && (
          <h6 className={classes.coordinateWrapper}>
            {props.longitude} <span className={classes.long}>(Longitude)</span>
          </h6>
        )}
      </div>
    </li>
  );
}

export default SatelliteItem;
