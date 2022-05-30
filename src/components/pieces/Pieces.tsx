import { 
    faChessKing, 
    faChessQueen, 
    faChessBishop,
    faChessKnight,
    faChessRook,
    faChessPawn } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Team } from "../../lib/Team";

const filterCss = "drop-shadow(2px 2px 5px rgb(0 0 0 / 0.4))";

function getPieceColor(team: Team) {
    return team === Team.White ? "#FFFFF0" : "#342C25"; // ivory and cola
}

export const King = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessKing} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;

export const Queen = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessQueen} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;

export const Bishop = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessBishop} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;

export const Knight = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessKnight} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;

export const Rook = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessRook} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;

export const Pawn = (props: { team: Team }) => 
    <FontAwesomeIcon icon={faChessPawn} style={{ 
        color: getPieceColor(props.team),
        filter: filterCss
    }}/>;