import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

export function isLegalPawnMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const origin = getSquare(boardState, orig);
    const destination = getSquare(boardState, dest);

    if (origin.piece == null) {
        throw new Error(`Square at (${origin.file}, ${origin.rank}) does not have a piece!`)
    }

    const [fileMovement, rankMovement] = getMovement(orig, dest);

    if (isMovingInWrongDirection(origin.piece.team, rankMovement))
        return false;

    // Get pawn vertical range
    const rankMagnitude: number = Math.abs(rankMovement);

    // Can't travel more than two vertically
    if (rankMagnitude > 2) {
        return false;
    }

    // Can't capture same team
    if (destinationHasSameTeam(origin.piece.team, destination)) {
        return false;
    }

    // If moving to a different file
    if (origin.file !== destination.file) {
        // It must be by one
        if (Math.abs(destination.file - origin.file) > 1) {
            return false;
        }

        // Must travel by one vertical space
        // There must be an enemy piece
    }

    // Moving on same file
    else {
        if (rankMagnitude === 2) {
            if (origin.piece.team === Team.White && origin.rank !== 1) {
                return false;
            }

            if (origin.piece.team === Team.Black && origin.rank !== 6) {
                return false;
            }
        }
    }


    if (destinationHasEnemyTeam(origin.piece.team, destination)) {
        // if pawn's destination has an enemy,
        // it can only move one diagonal forward
        
    }

    return true;
}

const isMovingInWrongDirection = (team: Team, rankMovement: number) => {
    return ((team === Team.White && !(rankMovement > 0))
    || (team === Team.Black && !(rankMovement < 0)));
}


function destinationHasSameTeam(origTeam: Team, dest: SquareState) {
    return dest.piece && dest.piece.team === origTeam;
}

function destinationHasEnemyTeam(origTeam: Team, dest: SquareState) {
    return dest.piece && dest.piece.team !== origTeam;
}
