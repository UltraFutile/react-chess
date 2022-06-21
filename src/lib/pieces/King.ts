import { BoardState, getMoveDiff } from "../model/BoardState";
import { SquareState } from "../model/SquareState";

export function isLegalKingMove(state: BoardState, orig: [number, number], dest: [number, number]): boolean {
    const [fileMovement, rankMovement] = getMoveDiff(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    if (fileMagnitude > 1 || rankMagnitude > 1)
        return false;

    return true;
};


export function getKingLegalMoves(state: BoardState, orig: [number, number]): SquareState[] {
    throw new Error("Not implemented");
}

const getSurroundingSquares = (file: number, rank: number, boardFileNum: number, boardRankNum: number) => {
    const moves: [number, number][] = [
        [ -1,  1], [ 0,  1], [ 1,  1],
        [ -1,  0],           [ 1,  0],
        [ -1, -1], [ 1, -1], [ 1, -1],
    ]   
}