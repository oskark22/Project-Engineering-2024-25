import classes from "./GnssItem.module.css"

function GnssItem(props) {

    return (
        <li className={classes.item}>
            <h2>{props.id} <span className={classes.satId}>Satellite ID (PRN Code)</span></h2>
            <h3>{props.type}</h3>
            <h4>{props.country}</h4>
        </li>
    )
}

export default GnssItem