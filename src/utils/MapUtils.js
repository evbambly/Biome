import {GROUND_TYPES} from "../AirStation/constants/terrain"
import {ROUTE_TYPES} from "../AirStation/constants/airStation"

const MapUtils =  {
      alertMarked: (hexagons) => {
        let markedString = "[";
        hexagons
          .filter((hex) => hex.isMarked)
          .forEach(({ q, r, s }) => {
            markedString += `{q:${q},r:${r},s:${s}},`;
          });
        markedString += "]";
        alert(markedString);
      },
       setClassnames: (hex) => {
        let className = "editable";
    
        if (hex.isMarked) {
          className += " marked";
        }
    
        if (Object.values(GROUND_TYPES).includes(hex.groundType)) {
          className += ` ${hex.groundType}`;
        }
    
        if (Object.values(ROUTE_TYPES).includes(hex.routeType)) {
          className += ` ${hex.routeType}`;
        }
        hex.className = className;
    
        return hex;
      },
}

export default MapUtils