import { BoardState } from "../../lib/model/BoardState";
import { SquareState } from "../../lib/model/SquareState";
import { Team } from "../../lib/Team";

export function toggleSquareSelect(state: BoardState, file: number, rank: number): BoardState {
    const newState: BoardState = {...state};
    const nextSquare: SquareState = newState.squareGrid[file][rank];

    if (nextSquare.selected) {
        nextSquare.selected = false;
        newState.currentlySelectedSquare = undefined;    
    }
    else {
        nextSquare.selected = true;
        if (newState.currentlySelectedSquare) {
            newState.currentlySelectedSquare.selected = false;
        }
        newState.currentlySelectedSquare = nextSquare;
    }

    return newState;
}

export function movePiece (state: BoardState, file: number, rank: number): BoardState {
    const newState: BoardState = {...state};

    let prevSelectedSquare = newState.currentlySelectedSquare;
    if (prevSelectedSquare == null || prevSelectedSquare.piece == null) {
        throw new Error("Attempted to move piece without selecting one");
    }
    
    const nextSquare: SquareState = newState.squareGrid[file][rank];
    newState.teamManager.removePiece(prevSelectedSquare.piece.team, prevSelectedSquare.piece.piece, prevSelectedSquare);
    newState.teamManager.addPiece(prevSelectedSquare.piece.team, prevSelectedSquare.piece.piece, nextSquare);


    if (nextSquare.piece) { // remove enemy piece from map
        newState.teamManager.removePiece(nextSquare.piece.team, nextSquare.piece.piece, nextSquare);
    }

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


    return newState;
}

export function changeTurn(state: BoardState) {
    state.teamManager.changeTurn();
}
