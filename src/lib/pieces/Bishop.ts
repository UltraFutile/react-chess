import { BoardState, getMoveDiff } from "../model/BoardState";
import { isClearDiagonalPath } from "./PieceHelpers";

export function isLegalBishopMove(state: BoardState, orig: [number, number], dest: [number, number]) {
    const [fileMovement, rankMovement] = getMoveDiff(orig, dest);
    const isMovingDiagonally = Math.abs(fileMovement) == Math.abs(rankMovement);
    return isMovingDiagonally && isClearDiagonalPath(state, orig, dest);
}
