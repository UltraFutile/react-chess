import React from 'react';
import { BoardState, BoardStateFactory } from '../../lib/model/BoardState';
import { SquareState } from '../../lib/model/SquareState';
import { Square } from '../Square';

import './Board.css'
import { onSquareClickFactory } from './ValidateBoardAction';

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
    const boardState: BoardState = boardStateFactory.createBoardState();
    boardStateFactory.setBoardPieces(boardState.squareGrid);
    
    const [state, setBoardState] = React.useState<BoardState>(boardState);

    const renderSquare = (squareState: SquareState) => {
        return <Square 
            key={`${squareState.file}${squareState.rank}`} 
            file={squareState.file} 
            rank={squareState.rank} 
            color={squareState.color} 
            piece={squareState.piece}
            selected={squareState.selected}
            onClick={onSquareClickFactory(state, setBoardState)} 
        />;
    }

    const renderSquares = () => {
        console.log("render squares");
        const rows = [];
        for (let i = 0; i < state.fileNum; i++) {
            const row = [];
            for (let j = 0; j < state.rankNum; j++) {
                let squareState: SquareState = state.squareGrid[i][j];
                row.push(renderSquare(squareState));
            }
            rows.push(
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

