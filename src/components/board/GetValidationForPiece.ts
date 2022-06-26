import { BoardState } from "../../lib/model/BoardState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { isLegalKingMove } from '../../lib/pieces/King';
import { Piece } from '../../lib/model/PieceProps';

export const getValidationForPiece = (piece: Piece) => {
    switch (piece) {
        case 'pawn':
            return isLegalPawnMove;
        case 'knight':
            return isLegalKnightMove;
        case 'rook':
            return isLegalRookMove;
        case 'bishop':
            return isLegalBishopMove;
        case 'king':
            return isLegalKingMove;
        case 'queen':
            return (state: BoardState, orig: [number, number], dest: [number, number]) => {
                return isLegalBishopMove(state, orig, dest)
                    || isLegalRookMove(state, orig, dest);
            };
    }
};
