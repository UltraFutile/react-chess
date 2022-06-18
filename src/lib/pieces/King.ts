import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";

export function isLegalKingMove(state: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    if (fileMagnitude > 1 || rankMagnitude > 1)
        return false;

    return true;
};