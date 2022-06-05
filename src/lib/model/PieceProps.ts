import { Team } from "../Team";

export type Piece = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';

export type PieceProps = {
    team: Team;
    piece: Piece;
}