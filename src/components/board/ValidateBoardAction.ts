import React from 'react';
import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { unselectSquare, selectNewSquare, movePiece } from "./UpdateBoardState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { isLegalKingMove } from '../../lib/pieces/King';
import { Team } from '../../lib/Team';

export const onSquareClickFactory = (state: BoardState, setState: React.Dispatch<React.SetStateAction<BoardState>>) => 
    (fileIndex: number, rankIndex: number) => () => {
    const clickedSquare: SquareState = state.squareGrid[fileIndex][rankIndex];
    const sameSquareSelected = clickedSquare.selected;
    const noPieceSelected = state.currentlySelectedSquare == null && clickedSquare.piece == null;

    if (noPieceSelected)
        return;
    
    if (sameSquareSelected) {
        setState(unselectSquare(state, fileIndex, rankIndex));
    }
    else if (isNewPieceSelected(state.currentlySelectedSquare, clickedSquare, state.whichTeamsTurn)) {
        setState(selectNewSquare(state, fileIndex, rankIndex));
    }
    else if (validateMove(state, fileIndex, rankIndex)) {
        setState(movePiece(state, fileIndex, rankIndex));
    }
};

const isNewPieceSelected = (prevSquare: SquareState | undefined, nextSquare: SquareState, currentTeam: Team) => {
    const noPieceSelectedYet = prevSquare == null || prevSquare.piece == null;
    const currentTeamPieceSelected = nextSquare.piece?.team === currentTeam;
    return noPieceSelectedYet && currentTeamPieceSelected;
}

const validateMove = (state: BoardState, file: number, rank: number): boolean => {
    let prevSelectedSquare = state.currentlySelectedSquare;
    if (prevSelectedSquare == null || prevSelectedSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }

    const nextSquare: SquareState = state.squareGrid[file][rank];

    // validate move attempt
    let isValidMove: boolean = true;
    switch(prevSelectedSquare.piece.piece) {
        case 'pawn':
            isValidMove = isLegalPawnMove(state, getCoordinates(prevSelectedSquare), getCoordinates(nextSquare));
            break;
        case 'knight':
            isValidMove = isLegalKnightMove(state, getCoordinates(prevSelectedSquare), getCoordinates(nextSquare));
            break;
        case 'rook':
            isValidMove = isLegalRookMove(state, getCoordinates(prevSelectedSquare), getCoordinates(nextSquare));
            break;
        case 'bishop':
            isValidMove = isLegalBishopMove(state, getCoordinates(prevSelectedSquare), getCoordinates(nextSquare));
            break;
        case 'king':
            isValidMove = isLegalKingMove(state, getCoordinates(prevSelectedSquare), getCoordinates(nextSquare));
            break;
    }

    return isValidMove;
}
