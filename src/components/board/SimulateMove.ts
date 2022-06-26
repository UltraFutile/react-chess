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

    let capturedPiece: PieceProps | undefined;

    if (nextSquare.piece) {
        capturedPiece = nextSquare.piece;
        state.teamManager.removePiece(enemyTeam, nextSquare.piece.piece, nextSquare);
    }

    state.teamManager.removePiece(currentTeam, prevSquare.piece.piece, prevSquare);
    state.teamManager.addPiece(currentTeam, prevSquare.piece.piece, nextSquare);

    // capture
    nextSquare.piece = prevSquare.piece;
    prevSquare.piece = undefined;

    const result: boolean = validationFunction();

    // revert move
    prevSquare.piece = nextSquare.piece;

    state.teamManager.removePiece(currentTeam, prevSquare.piece.piece, nextSquare);
    state.teamManager.addPiece(currentTeam, prevSquare.piece.piece, prevSquare);

    if (capturedPiece) {
        nextSquare.piece = capturedPiece;
        state.teamManager.addPiece(enemyTeam, nextSquare.piece.piece, nextSquare);
    }
    else {
        nextSquare.piece = undefined;

    }

    return result;
};
