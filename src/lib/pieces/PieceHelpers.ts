import { Coordinates } from "../../types/AlgebraicNotation";
import { diagonalMovementGenerator, straightMovementGenerator } from "../BoardIterators";
import { BoardState } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

export function destinationHasSameTeam (origTeam: Team, dest: SquareState) {
    return dest.piece && dest.piece.team === origTeam;
}

export function isClearStraightPath(state: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const squareIterator = straightMovementGenerator(state, orig, dest);
    for (const square of squareIterator) {
        if (square.piece)
            return false;
    }
    return true;
}

export function isClearDiagonalPath(state: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const diagonalIterator = diagonalMovementGenerator(state, orig, dest);
    for (const square of diagonalIterator) {
        if (square.piece)
                return false;
    }
    return true;   
}
