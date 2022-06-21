import { BoardState, getMoveDiff } from "./model/BoardState";

export function* straightMovementGenerator(
    boardState: BoardState, 
    [origFile, origRank]: [number, number], 
    [destFile, destRank]: [number, number], 
    includeEndSquares: boolean = false) {
    const [fileMovement, rankMovement] = getMoveDiff([origFile, origRank], [destFile, destRank]);

    const isMovingOnFile = fileMovement !== 0 && rankMovement === 0;
    const isMovingOnRank = fileMovement === 0 && rankMovement !== 0;

    const fileIncrement = (isMovingOnFile ? 1 : 0) * (fileMovement < 0 ? -1 : 1);
    const rankIncrement = (isMovingOnRank ? 1 : 0) * (rankMovement < 0 ? -1 : 1);

    let fileIndex = origFile + (includeEndSquares ? 0 : fileIncrement);
    let rankIndex = origRank + (includeEndSquares ? 0 : rankIncrement);

    let finalFileIndex = destFile + (includeEndSquares ? fileIncrement : 0)
    let finalRankIndex = destRank + (includeEndSquares ? rankIncrement : 0)

    while (fileIndex !== finalFileIndex || rankIndex !== finalRankIndex) {
        yield boardState.squareGrid[fileIndex][rankIndex];

        fileIndex += fileIncrement;
        rankIndex += rankIncrement;
    }
}

export function* diagonalMovementGenerator(
    boardState: BoardState, 
    [origFile, origRank]: [number, number], 
    [destFile, destRank]: [number, number], 
    includeEndSquares: boolean = false) {
    const [fileMovement, rankMovement] = getMoveDiff([origFile, origRank], [destFile, destRank]);

    const fileIncrement = fileMovement < 0 ? -1 : 1;
    const rankIncrement = rankMovement < 0 ? -1 : 1;

    let fileIndex = origFile + (includeEndSquares ? 0 : fileIncrement);
    let rankIndex = origRank + (includeEndSquares ? 0 : rankIncrement);

    let finalFileIndex = destFile + (includeEndSquares ? fileIncrement : 0)
    let finalRankIndex = destRank + (includeEndSquares ? rankIncrement : 0)

    while (fileIndex !== finalFileIndex || rankIndex !== finalRankIndex) {
        yield boardState.squareGrid[fileIndex][rankIndex];

        fileIndex += fileIncrement;
        rankIndex += rankIncrement;
    }
}