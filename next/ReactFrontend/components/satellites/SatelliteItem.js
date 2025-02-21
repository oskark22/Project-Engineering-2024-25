import classes from './SatelliteItem.module.css'

function SatelliteItem(props) {

    return (
        <li className={classes.item}>
            <div className={classes.content}>
                <h2>{props.id}</h2>
                <h3>{props.type}</h3>
                <h4>{props.country}</h4>
            </div>
        </li>
    )
}


export default SatelliteItem;