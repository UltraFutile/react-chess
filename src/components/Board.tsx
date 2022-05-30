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

    const onSquareClick = (file: number, rank: number) => {
        const newState: BoardState = {...boardState};
        const clickedSquare: SquareState = newState.squareGrid[file][rank];

        console.log(`FILE: ${file}, RANK: ${rank}`);
        if (clickedSquare.piece) {
            console.log(`Has piece ${clickedSquare.piece.piece}, for team ${clickedSquare.piece.team.toString()}`)
        }
        else {
            console.log("No piece on square");
        }

        if (clickedSquare.selected) {
            clickedSquare.selected = false;
            newState.selected = null;
        }
        else {
            if (newState.selected) {
                newState.squareGrid[newState.selected[0]][newState.selected[1]].selected = false;
            }    

            clickedSquare.selected = true;
            newState.selected = [file, rank];          
        }

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
            
        />; //'\u265C' for black knight
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

