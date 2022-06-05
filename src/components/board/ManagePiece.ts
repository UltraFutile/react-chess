import { BoardState, getSquare } from "../../lib/model/BoardState";
import { Piece } from "../../lib/model/PieceProps";
import { Team } from "../../lib/Team";
import { Coordinates } from "../../types/AlgebraicNotation";


export function addPiece(state: BoardState, team: Team, piece: Piece, coordinates: Coordinates) {
    const square = getSquare(state, coordinates);
    square.piece = { piece, team };
}