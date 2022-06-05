import { BoardRank, Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getDestination, getMovement, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

const MAX_PAWN_VERTICAL_RANGE: number = 2;
const WHITE_PAWN_START_RANK: BoardRank = 2;
const BLACK_PAWN_START_RANK: BoardRank = 7;

export function isLegalPawnMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const origin: SquareState = getSquare(boardState, orig);
    const destination: SquareState = getSquare(boardState, dest);

    if (origin.piece == null) {
        throw new Error(`Square at (${origin.file}, ${origin.rank}) does not have a piece!`)
    }

    const originTeam: Team = origin.piece.team;
    const rankDirection: number = originTeam === Team.White ? 1 : -1;
    const startingRank: BoardRank = originTeam === Team.White ? WHITE_PAWN_START_RANK : BLACK_PAWN_START_RANK;

    const [fileMovement, rankMovement] = getMovement(orig, dest);

    if (isMovingInWrongDirection(originTeam, rankMovement))
        return false;

    const rankMagnitude: number = Math.abs(rankMovement);

    if (rankMagnitude > MAX_PAWN_VERTICAL_RANGE)
        return false;

    if (destinationHasSameTeam(originTeam, destination))
        return false;

    if (origin.file !== destination.file) {
        if (Math.abs(fileMovement) > 1 || rankMagnitude !== 1)
            return false;

        // TODO: Not strictly correct, 
        // does not handle special 'En passant' move. Comeback after state starts storing
        // previous board states.
        if (!destinationHasEnemyTeam(originTeam, destination))
            return false;
    }
    else {
        if (rankMagnitude === MAX_PAWN_VERTICAL_RANGE && (orig[1] !== startingRank || destination.piece))
            return false;
            
        // if there's any piece in front of pawn, move is illegal
        const immediateSquare = getSquare(boardState, getDestination(boardState, orig, { rank: 1 * rankDirection }));
        if (immediateSquare.piece)
            return false;
    }

    return true;
}

const isMovingInWrongDirection = (team: Team, rankMovement: number) => {
    return ((team === Team.White && !(rankMovement > 0))
    || (team === Team.Black && !(rankMovement < 0)));
}

const destinationHasSameTeam = (origTeam: Team, dest: SquareState) => {
    return dest.piece && dest.piece.team === origTeam;
}

const destinationHasEnemyTeam = (origTeam: Team, dest: SquareState) => {
    return dest.piece && dest.piece.team !== origTeam;
}
