import { BoardState, getMoveDiff, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";

export function isLegalKingMove(state: BoardState, orig: [number, number], dest: [number, number]): boolean {
    const [fileMovement, rankMovement] = getMoveDiff(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    if (fileMagnitude > 1 || rankMagnitude > 1)
        return false;

    return true;
};

export function getKingPossibleMoves(state: BoardState, [file, rank]: [number, number]): SquareState[] {
    const kingSquare = getSquare(state, [file, rank]);
    if (kingSquare.piece == null || kingSquare.piece.piece !== 'king') {
        throw new Error("Square has no king.");
    }

    let kingTeam: Team = kingSquare.piece.team;
    const immediateMoves: [number, number][] = getImmediateMoves(file, rank, state.fileNum, state.rankNum);
    return immediateMoves
        .map((square) => getSquare(state, square))
        .filter((square) => (square.piece == null) || (square.piece.team !== kingTeam));
}

const getImmediateMoves = (file: number, rank: number, boardFileNum: number, boardRankNum: number) => {
    const moves: [number, number][] = [
        [ -1,  1], [ 0,  1], [ 1,  1],
        [ -1,  0],           [ 1,  0],
        [ -1, -1], [ 0, -1], [ 1, -1],
    ];
    return moves.map((move) => [file + move[0], rank + move[1]] as [number, number])
                .filter((square) => isSquareOnBoard(square, boardFileNum, boardRankNum));
}

const isSquareOnBoard = ([file, rank]: [number, number], boardFileNum: number, boardRankNum: number) => 
    (file >= 0 && file < boardFileNum) && (rank >= 0 && rank < boardRankNum);
