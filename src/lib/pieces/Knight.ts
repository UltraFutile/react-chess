import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement } from "../model/BoardState";

export function isLegalKnightMove(state: BoardState, orig: Coordinates, dest: Coordinates) {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    return ((fileMagnitude === 2 && rankMagnitude === 1)
            || (fileMagnitude === 1 && rankMagnitude === 2));
}
