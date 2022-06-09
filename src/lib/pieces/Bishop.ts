import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";
import { isClearDiagonalPath } from "./PieceHelpers";

export function isLegalBishopMove(boardState: BoardState, orig: Coordinates, dest: Coordinates) {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    if (fileMagnitude !== rankMagnitude)
        return false;
    
    return isClearDiagonalPath(boardState, orig, dest);
}
