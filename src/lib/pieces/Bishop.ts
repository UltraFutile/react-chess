import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, getMovement, getSquare } from "../model/BoardState";
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
    
    return true;       
}