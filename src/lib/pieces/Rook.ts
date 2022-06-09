import { Coordinates } from "../../types/AlgebraicNotation";
import { straightMovementGenerator } from "../BoardIterators";
import { BoardState, getMovement } from "../model/BoardState";

export function isLegalRookMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    const isMovingOnFile = fileMagnitude > 0 && rankMagnitude === 0;
    const isMovingOnRank = fileMagnitude === 0 && rankMagnitude > 0;

    if (!isMovingOnFile && !isMovingOnRank)
        return false;
    
    // check if there is any obstacle between origin and destination
    const squareIterator = straightMovementGenerator(boardState, orig, dest);
    for (const square of squareIterator) {
        if (square.piece)
            return false;
    }

    return true;
}
