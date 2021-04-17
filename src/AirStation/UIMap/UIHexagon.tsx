import React from "react";
import { GroundType } from "../constants/terrain";
import { HexCoords, Route } from "../GameEngine/hexagon"


const ReactHexGrid = require("react-hexgrid");

interface UIHexagonProps {
    position: HexCoords,
    isMarked: boolean,
    groundType: GroundType,
    route?: Route
    hasShip?: boolean
}

export default function UIHexagon({ position, groundType, route, isMarked, hasShip }: UIHexagonProps) {

    const { Hexagon: HexagonComponent } = ReactHexGrid

    let className = "editable";

    if (isMarked) {
        className += " marked";
    }

    if (Object.values(GroundType).includes(groundType)) {
        className += ` ${groundType}`;
    }

    if (route?.type) {
        className += ` ${route?.type}`;
    }

    return (<HexagonComponent
        {...position}
        className={className}
        fill={hasShip ? "airship" : undefined}
    />
    )
}