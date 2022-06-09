import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";
import { isClearStraightPath } from "./PieceHelpers";

export function isLegalRookMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    const isMovingOnFile = fileMagnitude > 0 && rankMagnitude === 0;
    const isMovingOnRank = fileMagnitude === 0 && rankMagnitude > 0;

    if (!isMovingOnFile && !isMovingOnRank)
        return false;

    return isClearStraightPath(boardState, orig, dest);
}
