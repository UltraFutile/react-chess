import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getCoordinatesFromIndexes, getIndexesFromCoordinates, getMovement, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";
import { destinationHasSameTeam } from "./PieceHelpers";

export function isLegalRookMove(boardState: BoardState, orig: Coordinates, dest: Coordinates): boolean {
    const origin: SquareState = getSquare(boardState, orig);
    const destination: SquareState = getSquare(boardState, dest);
    
    if (origin.piece == null) {
        throw new Error(`Square at (${origin.file}, ${origin.rank}) does not have a piece!`)
    }

    const originTeam: Team = origin.piece.team;
    
    if (destinationHasSameTeam(originTeam, destination))
        return false;
    
    const [fileMovement, rankMovement] = getMovement(orig, dest);
    const fileMagnitude: number = Math.abs(fileMovement);
    const rankMagnitude: number = Math.abs(rankMovement);

    const isMovingOnFile = fileMagnitude > 0 && rankMagnitude === 0;
    const isMovingOnRank = fileMagnitude === 0 && rankMagnitude > 0;

    if (!isMovingOnFile && !isMovingOnRank)
        return false;
    
    // check if there is any obstacle between origin and destination
    const [originFileIndex, originRankIndex] = getIndexesFromCoordinates(orig);
    const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(dest);

    if (isMovingOnFile) {
        if (fileMovement > 0 ) { // moving up
            for (let i = originFileIndex + 1; i < destFileIndex; i++) {
                const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(i, originRankIndex));
                if (square.piece)
                    return false;
            }
        }
        else { // moving down
            for (let i = originFileIndex - 1; i > destFileIndex; i--) {
                const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(i, originRankIndex));
                if (square.piece)
                    return false;
            }
        }
        
    }
    else if (isMovingOnRank) {
        if (rankMovement > 0) { // moving right
            for (let i = originRankIndex + 1; i < destRankIndex; i++) {
                const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(originFileIndex, i));
                if (square.piece)
                    return false;
            }
        }
        else {
            for (let i = originRankIndex - 1; i > destRankIndex; i--) {
                const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(originFileIndex, i));
                if (square.piece)
                    return false;
            }
        }
    }

    return true;
}