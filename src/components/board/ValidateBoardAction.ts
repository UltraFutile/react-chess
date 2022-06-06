import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { unselectSquare, selectNewSquare, movePiece } from "./UpdateBoardState";
import React from 'react';
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";



export function onSquareClickFactory(state: BoardState, setState: React.Dispatch<React.SetStateAction<BoardState>> ) {
    return (file: number, rank: number) => {
        const clickedSquare: SquareState = state.squareGrid[file][rank];
        if (state.currentlySelectedSquare == null && clickedSquare.piece == null)
            return;
    
        let newState: BoardState | undefined;
        
        if (clickedSquare.selected) {
            newState = unselectSquare(state, file, rank);
        }
        else if (state.currentlySelectedSquare == null || state.currentlySelectedSquare.piece == null) {
            if (state.whichTeamsTurn === clickedSquare.piece?.team) {
                newState = selectNewSquare(state, file, rank);
            }
        }
        else {
            if (validateMove(state, file, rank)) {
                newState = movePiece(state, file, rank);
            }
        }
    
        if (newState)
            setState(newState);
    };
}

function validateMove(state: BoardState, file: number, rank: number): boolean {
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
    }

    return isValidMove;
}
