import { BoardState, getMoveDiff } from "../model/BoardState";
import { isClearStraightPath } from "./PieceHelpers";

export function isLegalRookMove(state: BoardState, orig: [number, number], dest: [number, number]): boolean {
    const [fileMove, rankMove] = getMoveDiff(orig, dest);
    const isMovingStraight = fileMove * rankMove === 0 && fileMove + rankMove !== 0;
    return isMovingStraight && isClearStraightPath(state, orig, dest);
}
