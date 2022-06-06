import { Coordinates } from "../types/AlgebraicNotation";
import { BoardState, getIndexesFromCoordinates, getMovement, getSquare, getCoordinatesFromIndexes } from "./model/BoardState";

export function* straightMovementGenerator(boardState: BoardState, orig: Coordinates, dest: Coordinates, includeEndSquares: boolean = false) {
    const [originFileIndex, originRankIndex] = getIndexesFromCoordinates(orig);
    const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(dest);
    const [fileMovement, rankMovement] = getMovement(orig, dest);

    const isMovingOnFile = fileMovement !== 0 && rankMovement === 0;
    const isMovingOnRank = fileMovement === 0 && rankMovement !== 0;

    const fileIncrement = (isMovingOnFile ? 1 : 0) * (fileMovement < 0 ? -1 : 1);
    const rankIncrement = (isMovingOnRank ? 1 : 0) * (rankMovement < 0 ? -1 : 1);

    let fileIndex = originFileIndex + (includeEndSquares ? 0 : fileIncrement);
    let rankIndex = originRankIndex + (includeEndSquares ? 0 : rankIncrement);

    let finalFileIndex = destFileIndex + (includeEndSquares ? fileIncrement : 0)
    let finalRankIndex = destRankIndex + (includeEndSquares ? rankIncrement : 0)

    while (fileIndex !== finalFileIndex || rankIndex !== finalRankIndex) {
        yield getSquare(boardState, getCoordinatesFromIndexes(fileIndex, rankIndex));

        fileIndex += fileIncrement;
        rankIndex += rankIncrement;
    }
}