import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getCoordinatesFromIndexes, getIndexesFromCoordinates, getMovement, getSquare } from "../model/BoardState";
import { SquareState } from "../model/SquareState";
import { Team } from "../Team";
import { destinationHasSameTeam } from "./PieceHelpers";

export function isLegalBishopMove(boardState: BoardState, orig: Coordinates, dest: Coordinates) {
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

    if (fileMagnitude !== rankMagnitude)
        return false;
    
        const [origFileIndex, origRankIndex] = getIndexesFromCoordinates(orig);
        const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(dest);

    if (fileMovement > 0 && rankMovement > 0) { // NE
        for (let fileIndex = origFileIndex + 1, rankIndex = origRankIndex + 1; 
            fileIndex < destFileIndex && rankIndex < destRankIndex; fileIndex++, rankIndex++) {
            const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(fileIndex, rankIndex));
            if (square.piece)
                return false;
        }
    }
    else if (fileMovement > 0 && rankMovement < 0) { // SE
        for (let fileIndex = origFileIndex + 1, rankIndex = origRankIndex - 1; 
            fileIndex < destFileIndex && rankIndex > destRankIndex; fileIndex++, rankIndex--) {
            const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(fileIndex, rankIndex));
            if (square.piece)
                return false;
        }
    }
    else if (fileMovement < 0 && rankMovement > 0) { // NW
        for (let fileIndex = origFileIndex - 1, rankIndex = origRankIndex + 1; 
            fileIndex > destFileIndex && rankIndex < destRankIndex; fileIndex--, rankIndex++) {
            const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(fileIndex, rankIndex));
            if (square.piece)
                return false;
        }
    }
    else { // SW
        for (let fileIndex = origFileIndex - 1, rankIndex = origRankIndex - 1; 
            fileIndex > destFileIndex && rankIndex > destRankIndex; fileIndex--, rankIndex--) {
            const square: SquareState = getSquare(boardState, getCoordinatesFromIndexes(fileIndex, rankIndex));
            if (square.piece)
                return false;
        }
    }

    return true;       
}