import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { isLegalBishopMove } from "../../lib/pieces/Bishop";
import { isLegalKnightMove } from "../../lib/pieces/Knight";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";
import { isLegalRookMove } from "../../lib/pieces/Rook";
import { Team } from "../../lib/Team";

export function unselectSquare(state: BoardState, file: number, rank: number): BoardState {
    const newState: BoardState = {...state};
    const square: SquareState = newState.squareGrid[file][rank];
    square.selected = false;
    newState.currentlySelectedSquare = undefined;
    return newState;
}

export function selectNewSquare(state: BoardState, file: number, rank: number): BoardState {
    const newState: BoardState = {...state};
    let previouslySelectedSquare = newState.currentlySelectedSquare;
    if (previouslySelectedSquare) {
        previouslySelectedSquare.selected = false;
    }

    const square: SquareState = newState.squareGrid[file][rank];
    square.selected = true;
    newState.currentlySelectedSquare = square;

    return newState;
}

export function validateMove(state: BoardState, file: number, rank: number): boolean {
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

export function movePiece (state: BoardState, file: number, rank: number): BoardState {
    const newState: BoardState = {...state};

    let prevSelectedSquare = newState.currentlySelectedSquare;
    if (prevSelectedSquare == null || prevSelectedSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }

    const nextSquare: SquareState = newState.squareGrid[file][rank];

    // remove piece from previously selected square
    let piece = prevSelectedSquare.piece.piece;
    let team = prevSelectedSquare.piece.team;
    prevSelectedSquare.piece = undefined;
    
    // add this piece to the next selected square
    nextSquare.piece = {
        piece : piece,
        team: team
    };

    nextSquare.selected = false;
    newState.currentlySelectedSquare = undefined;
    prevSelectedSquare.selected = false;

    // Change whose turn it is
    newState.whichTeamsTurn = newState.whichTeamsTurn === Team.White ? Team.Black : Team.White;

    return newState;
}