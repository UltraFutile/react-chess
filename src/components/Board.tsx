import React from 'react';
import { BoardState, BoardStateFactory } from '../lib/model/BoardState';
import { SquareState } from '../lib/model/SquareState';
import './Board.css'
import { Square } from "./Square";

/**
 * Should maintain state of:
 *  - Board
 *  - Able to lookup any random square in constant time
 * 
 * Game manager should be able to:
 *  - Use board to find all pieces
 * 
 */
export const Board = () => {
    const boardStateFactory = new BoardStateFactory();

    const [boardState, setBoardState] = React.useState<BoardState>(boardStateFactory.createBoardState());

    const unselectSquare = (state: BoardState, file: number, rank: number): BoardState => {
        const square: SquareState = state.squareGrid[file][rank];
        square.selected = false;
        state.selectedSquare = undefined;
        return state;
    }

    const selectNewSquare = (state: BoardState, file: number, rank: number): BoardState => {
        const square: SquareState = state.squareGrid[file][rank];
        square.selected = true;
        state.selectedSquare = [file, rank];
        return state;
    }

    const onSquareClick = (file: number, rank: number) => {
        const clickedSquare: SquareState = boardState.squareGrid[file][rank];

        console.log(`FILE: ${file}, RANK: ${rank}`);
        if (clickedSquare.piece) {
            console.log(`Has piece ${clickedSquare.piece.piece}, for team ${clickedSquare.piece.team.toString()}`)
        }
        else {
            console.log("No piece on square");
        }

        // If you have not previously selected a piece,
        // and the square you clicked has no piece, nothing should happen
        if (boardState.selectedSquare == null && clickedSquare.piece == null)
            return;

        const newState: BoardState = {...boardState};

        // If square is already selected, simply unselect.
        if (clickedSquare.selected)
            return unselectSquare(newState, file, rank);

        if (newState.selectedSquare == null)
            return selectNewSquare(newState, file, rank);

        // Selecting different square
        // If previously selected square
        let prevSelectedSquare = newState.squareGrid[newState.selectedSquare[0]][newState.selectedSquare[1]];
        if (prevSelectedSquare.piece) { // moving a piece
            // remove piece from previously selected square
            let piece = prevSelectedSquare.piece.piece;
            let team = prevSelectedSquare.piece.team;

            prevSelectedSquare.piece = undefined;

            // add this piece to the next selected square
            clickedSquare.piece = {
                piece : piece,
                team: team
            };

            clickedSquare.selected = false;
            newState.selectedSquare = undefined;
        }
        else {
            clickedSquare.selected = true;
            newState.selectedSquare = [file, rank];
        }                
        
        prevSelectedSquare.selected = false;

        setBoardState(newState);
    };

    const renderSquare = (squareState: SquareState) => {
        return <Square 
            key={`${squareState.file}${squareState.rank}`} 
            file={squareState.file} 
            rank={squareState.rank} 
            color={squareState.color} 
            piece={squareState.piece}
            selected={squareState.selected}
            onClick={onSquareClick}
            
        />;
    }

    const renderSquares = () => {
        console.log("render squares");
        const rows = [];
        for (let i = 0; i < boardState.fileNum; i++) {
            const row = [];
            for (let j = 0; j < boardState.rankNum; j++) {
                let squareState: SquareState = boardState.squareGrid[i][j];
                row.push(renderSquare(squareState));
            }
            rows.unshift(
                <div key={i} className="board-row">
                    {row}
                </div>
            )
        }
        return rows;
    }

    return (
        <div className="board-shell">
            {renderSquares()}
        </div>
    );
}

