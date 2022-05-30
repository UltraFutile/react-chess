import { PieceProps } from "./PieceProps";

export interface SquareState {
    color: string;
    file: number;
    rank: number;
    piece?: PieceProps;
}
