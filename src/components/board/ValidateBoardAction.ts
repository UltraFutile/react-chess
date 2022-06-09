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
    const prevSquare = state.currentlySelectedSquare;
    const nextSquare: SquareState = state.squareGrid[fileIndex][rankIndex];
    const sameSquareSelected = nextSquare.selected;
    const noPieceSelected = prevSquare == null && nextSquare.piece == null;

    if (noPieceSelected)
        return;

    if (sameSquareSelected) {
        setState(unselectSquare(state, fileIndex, rankIndex));
    }
    else if (isNewPieceSelected(prevSquare, nextSquare, state.whichTeamsTurn)) {
        setState(selectNewSquare(state, fileIndex, rankIndex));
    }
    else if (validateMove(prevSquare, nextSquare, state)) {
        setState(movePiece(state, fileIndex, rankIndex));
    }
};

const isNewPieceSelected = (prevSquare: SquareState | undefined, nextSquare: SquareState, currentTeam: Team) => {
    const noPieceSelectedYet = prevSquare == null || prevSquare.piece == null;
    const currentTeamPieceSelected = nextSquare.piece?.team === currentTeam;
    return noPieceSelectedYet && currentTeamPieceSelected;
}

const validateMove = (prevSquare: SquareState | undefined, nextSquare: SquareState, state: BoardState): boolean => {
    if (prevSquare == null || prevSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }

    // validate move attempt
    let isValidMove: boolean = true;
    switch(prevSquare.piece.piece) {
        case 'pawn':
            isValidMove = isLegalPawnMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'knight':
            isValidMove = isLegalKnightMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'rook':
            isValidMove = isLegalRookMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'bishop':
            isValidMove = isLegalBishopMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
        case 'king':
            isValidMove = isLegalKingMove(state, getCoordinates(prevSquare), getCoordinates(nextSquare));
            break;
    }

    return isValidMove;
}
