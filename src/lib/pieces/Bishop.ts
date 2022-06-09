import { Coordinates } from "../../types/AlgebraicNotation";
import { diagonalMovementGenerator } from "../BoardIterators";
import { BoardState, getMovement } from "../model/BoardState";

export function isLegalBishopMove(boardState: BoardState, orig: Coordinates, dest: Coordinates) {

    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    if (fileMagnitude !== rankMagnitude)
        return false;
    
    const diagonalIterator = diagonalMovementGenerator(boardState, orig, dest);
    for (const square of diagonalIterator) {
        if (square.piece)
                return false;
    }

    return true;       
}