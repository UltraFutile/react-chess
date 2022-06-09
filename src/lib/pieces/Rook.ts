import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";
import { isClearStraightPath } from "./PieceHelpers";

export function isLegalRookMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const [fileMove, rankMove] = getMovement(orig, dest);
    const isMovingStraight = fileMove * rankMove === 0 && fileMove + rankMove !== 0;
    return isMovingStraight && isClearStraightPath(boardState, orig, dest);
}
