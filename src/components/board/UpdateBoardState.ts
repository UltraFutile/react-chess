import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";



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

export const updateBoardState = (state: BoardState, file: number, rank: number): BoardState => {
    const newState: BoardState = {...state};

    // If there is no currently selected square, select this one
    // OR if selecting different square from previously selected square
    movePiece(newState, file, rank);

    return newState;
};

const movePiece = (state: BoardState, file: number, rank: number) => {
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
    }

    if (!isValidMove) {
        return;
    }

    // moving a piece
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
    state.currentlySelectedSquare = undefined;
    prevSelectedSquare.selected = false;
}