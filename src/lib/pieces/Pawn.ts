import { BoardRank, Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

export function isLegalPawnMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const origin: SquareState = getSquare(boardState, orig);
    const destination: SquareState = getSquare(boardState, dest);

    if (origin.piece == null) {
        throw new Error(`Square at (${origin.file}, ${origin.rank}) does not have a piece!`)
    }

    const originTeam: Team = origin.piece.team;
    const rankDirection: number = originTeam === Team.White ? 1 : -1;
    const startingRank: BoardRank = originTeam === Team.White ? 2 : 7;

    const [fileMovement, rankMovement] = getMovement(orig, dest);

    if (isMovingInWrongDirection(originTeam, rankMovement))
        return false;

    // Get pawn vertical range
    const rankMagnitude: number = Math.abs(rankMovement);

    if (rankMagnitude > 2)
        return false;

    // Can't capture same team
    if (destinationHasSameTeam(originTeam, destination)) {
        return false;
    }

    if (origin.file !== destination.file) {
        // It must be by one
        if (Math.abs(fileMovement) > 1)
            return false;

        // Must travel by one vertical space
        // There must be an enemy piece
    }

    // Moving on same file
    else {
        if (rankMagnitude === 2) {
            if (orig[1] !== startingRank)
                return false;
        }
    }

    if (destinationHasEnemyTeam(originTeam, destination)) {
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
