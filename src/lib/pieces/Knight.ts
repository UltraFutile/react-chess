import { BoardState, getMoveDiff } from "../model/BoardState";

export function isLegalKnightMove(state: BoardState, orig: [number, number], dest: [number, number]) {
    const [fileMovement, rankMovement] = getMoveDiff(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    return ((fileMagnitude === 2 && rankMagnitude === 1)
            || (fileMagnitude === 1 && rankMagnitude === 2));
}
