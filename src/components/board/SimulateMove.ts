import { BoardState } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { Team } from '../../lib/Team';
import { PieceProps } from '../../lib/model/PieceProps';

// perform move
// perform check => fcn()
// revert move
export const simulateMove = (
    state: BoardState,
    prevSquare: SquareState,
    nextSquare: SquareState,
    validationFunction: () => boolean): boolean => {
    if (prevSquare.piece == null) {
        throw new Error("Attempted to simulate move without a moving piece.");
    }
    // Get team of moving piece
    const currentTeam = prevSquare.piece.team;
    const enemyTeam: Team = currentTeam === Team.White ? Team.Black : Team.White;

    const teamPieceMap = state.teamManager.getPieceMap(currentTeam);
    const enemyPieceMap = state.teamManager.getPieceMap(enemyTeam);

    let capturedPiece: PieceProps | undefined;

    if (nextSquare.piece) {
        capturedPiece = nextSquare.piece;
        enemyPieceMap[nextSquare.piece.piece].delete(nextSquare);
    }

    teamPieceMap[prevSquare.piece.piece].delete(prevSquare);
    teamPieceMap[prevSquare.piece.piece].add(nextSquare);

    // capture
    nextSquare.piece = prevSquare.piece;
    prevSquare.piece = undefined;

    const result: boolean = validationFunction();

    // revert move
    prevSquare.piece = nextSquare.piece;

    teamPieceMap[prevSquare.piece.piece].delete(nextSquare);
    teamPieceMap[prevSquare.piece.piece].add(prevSquare);

    if (capturedPiece) {
        nextSquare.piece = capturedPiece;
        enemyPieceMap[nextSquare.piece.piece].add(nextSquare);
    }
    else {
        nextSquare.piece = undefined;

    }

    if (teamPieceMap['king'].size > 1 || enemyPieceMap['king'].size > 1) {
        console.log("More than one king");
    }

    return result;
};
