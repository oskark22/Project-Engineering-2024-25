import classes from "./CelestrakItem.module.css";

function CelestrakItem(props) {
  return (
    <li className={classes.item}>
      <h2>{props.id}</h2>
      {props.latitude && (
        <h3 className={classes.coordinateWrapper}>
          {props.latitude} <span className={classes.lat}>(Latitude)</span>
        </h3>
      )}
      {props.longitude && (
        <h4 className={classes.coordinateWrapper}>
          {props.longitude} <span className={classes.long}>(Longitude)</span>
        </h4>
      )}
    </li>
  );
}

export default CelestrakItem;