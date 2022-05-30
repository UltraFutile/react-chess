import { Team } from "../Team";

export type PieceProps = {
    team: Team;
    piece: 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';
}