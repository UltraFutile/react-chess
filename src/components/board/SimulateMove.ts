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

    const teamPieceMap = currentTeam === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = currentTeam === Team.White ? state.blackPieceMap : state.whitePieceMap;

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
