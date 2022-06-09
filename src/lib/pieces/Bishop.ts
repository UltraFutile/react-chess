import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";
import { isClearDiagonalPath } from "./PieceHelpers";

export function isLegalBishopMove(boardState: BoardState, orig: Coordinates, dest: Coordinates) {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const isMovingDiagonally = Math.abs(fileMovement) == Math.abs(rankMovement);
    return isMovingDiagonally && isClearDiagonalPath(boardState, orig, dest);
}
