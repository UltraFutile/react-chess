import React from 'react';
import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { toggleSquareSelect, movePiece } from "./UpdateBoardState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { isLegalKingMove } from '../../lib/pieces/King';
import { Team } from '../../lib/Team';
import { destinationHasSameTeam } from '../../lib/pieces/PieceHelpers';
import { Piece, PieceProps } from '../../lib/model/PieceProps';
import { Coordinates } from '../../types/AlgebraicNotation';

export const onSquareClickFactory = (state: BoardState, setState: React.Dispatch<React.SetStateAction<BoardState>>) => 
    (fileIndex: number, rankIndex: number) => () => {
    const prevSquare = state.currentlySelectedSquare;
    const nextSquare: SquareState = state.squareGrid[fileIndex][rankIndex];
    const sameSquareSelected = nextSquare.selected;

    if (prevSquare == null 
        && (nextSquare.piece == null || nextSquare.piece.team !== state.whichTeamsTurn)) {
        return;
    }
    
    if (sameSquareSelected || teamPieceSelected(nextSquare, state.whichTeamsTurn)) {
        setState(toggleSquareSelect(state, fileIndex, rankIndex));
    }
    else if (validateMove(state, prevSquare, nextSquare)) {
        setState(movePiece(state, fileIndex, rankIndex));
        // Check for checkmate OR stalemate


        // Get all team pieces attacking enemy king. (nextsquare piece, and then check  r/b/q)

        // no pieces attacking king? => check for stalemate
        // else, 

        // Are all the squares enemy king can move to being attacked?
        // Is there more than one piece attacking the king? -> true
        // - Can the piece attacking the king be captured?
        // - Can the piece attacking the king be blocked?

    }
};

const teamPieceSelected = (nextSquare: SquareState, currentTeam: Team) => {
    return nextSquare.piece?.team === currentTeam;
}

const validateMove = (state: BoardState, prevSquare: SquareState | undefined, nextSquare: SquareState): boolean => {
    if (prevSquare == null || prevSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }

    if (destinationHasSameTeam(prevSquare.piece.team, nextSquare))
        return false;

    // validate move attempt
    let isValidMove: boolean = getValidationForPiece(prevSquare.piece.piece)(state, getCoordinates(prevSquare), getCoordinates(nextSquare));

    if (!isValidMove) {
        return false;
    }

    const teamPieceMap = state.whichTeamsTurn === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = state.whichTeamsTurn === Team.White ? state.blackPieceMap : state.whitePieceMap;

    if (prevSquare.piece.piece === 'king') {
        // check if any enemy piece can attack king's new position. (maybe move this to under isLegalKingMove?)
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, () => {
            let piece: keyof typeof enemyPieceMap;
            for (piece in enemyPieceMap) {
                for (let square of enemyPieceMap[piece as keyof typeof enemyPieceMap]) {
                    if (getValidationForPiece(piece)(state, getCoordinates(square), getCoordinates(nextSquare))) {
                        console.log("Under attack by " + piece);
                        return true;
                    }
                }
            }
            return false;
        })

        return !doesMoveResultInCheck
    }
    else {
        // check for possible discovered checks
        //      this should involve temporarily performing the move, then check if enemy r/b/q can attack the king
        const kingSquare: SquareState = teamPieceMap['king'].values().next().value;
        console.log(kingSquare);
        const doesMoveResultInCheck = simulateMove(state, prevSquare, nextSquare, () => {
            let piecesThatCanDiscoverCheck: Piece[] = ['rook', 'bishop', 'queen'];
            for (let piece of piecesThatCanDiscoverCheck) {
                for (let square of enemyPieceMap[piece]) {
                    if (getValidationForPiece(piece)(state, getCoordinates(square), getCoordinates(kingSquare))) {
                        console.log("Under attack by " + piece);
                        return true;
                    }
                }
            }
            return false;
        });

        return !doesMoveResultInCheck;
    }
}


// perform move
// perform check => fcn()
// revert move

const simulateMove = (state: BoardState, prevSquare: SquareState, nextSquare: SquareState, validationFunction: () => boolean): boolean => {
    if (prevSquare.piece == null) {
        throw new Error("Attempted to simulate move without a moving piece.")
    }

    const teamPieceMap = state.whichTeamsTurn === Team.White ? state.whitePieceMap : state.blackPieceMap;
    const enemyPieceMap = state.whichTeamsTurn === Team.White ? state.blackPieceMap : state.whitePieceMap;
    
    let capturedPiece: PieceProps | undefined;

    if (nextSquare.piece) {
        capturedPiece = nextSquare.piece;
        enemyPieceMap[nextSquare.piece.piece].delete(nextSquare);
    }

    teamPieceMap[prevSquare.piece.piece].delete(prevSquare);
    teamPieceMap[prevSquare.piece.piece].add(nextSquare);

    nextSquare.piece = prevSquare.piece;
    prevSquare.piece = undefined;

    const result: boolean = validationFunction();

    // revert move
    prevSquare.piece = nextSquare.piece;

    teamPieceMap[prevSquare.piece.piece].delete(nextSquare);
    teamPieceMap[prevSquare.piece.piece].add(prevSquare);

    if (capturedPiece) {
        nextSquare.piece = capturedPiece;
        enemyPieceMap[nextSquare.piece.piece].add(nextSquare);
    }
    else {
        nextSquare.piece = undefined;
    }

    return result;
}

const getAllPiecesAttackingSquare = (state: BoardState, targetSquare: SquareState, pieceMap: Record<Piece, Set<SquareState>>) => {

}


const getValidationForPiece = (piece: Piece) => {
    switch(piece) {
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
            return (state: BoardState, orig: Coordinates, dest: Coordinates) => {
                return isLegalBishopMove(state, (orig), (dest))
                || isLegalRookMove(state, (orig), (dest));
            };
    }
}