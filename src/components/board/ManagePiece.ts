import { BoardState } from "../../lib/model/BoardState";
import { Piece } from "../../lib/model/PieceProps";
import { Team } from "../../lib/Team";

export function addPiece(state: BoardState, team: Team, piece: Piece, [file, rank]: [number, number]) {
    const square = state.squareGrid[file][rank];
    square.piece = { piece, team };
}