import { BoardState, getCoordinates } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { isLegalPawnMove } from "../../lib/pieces/Pawn";

export const updateBoardState = (state: BoardState, file: number, rank: number): BoardState => {
    const clickedSquare: SquareState = state.squareGrid[file][rank];
    const newState: BoardState = {...state};

    // If square is already selected, simply unselect.
    if (clickedSquare.selected) {
        unselectSquare(newState, file, rank);
    }

    // If there is no currently selected square, select this one
    // OR if selecting different square from previously selected square
    else if (newState.currentlySelectedSquare == null || newState.currentlySelectedSquare.piece == null) {
        selectNewSquare(newState, file, rank);
    }
    else {
        movePiece(newState, file, rank);
    }

    return newState;
};

const unselectSquare = (state: BoardState, file: number, rank: number) => {
    const square: SquareState = state.squareGrid[file][rank];
    square.selected = false;
    state.currentlySelectedSquare = undefined;
}

const selectNewSquare = (state: BoardState, file: number, rank: number) => {
    let previouslySelectedSquare = state.currentlySelectedSquare;
    if (previouslySelectedSquare) {
        previouslySelectedSquare.selected = false;
    }

    const square: SquareState = state.squareGrid[file][rank];
    square.selected = true;
    state.currentlySelectedSquare = square;
}

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