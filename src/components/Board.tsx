import React from 'react';
import { BoardState } from '../lib/model/BoardState';
import { PieceProps } from '../lib/model/PieceProps';
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
    const [boardState, setBoardState] = React.useState<BoardState>(new BoardState(8, 8));

    const onSquareClick = (file: number, rank: number) => {
        console.log(`FILE: ${file}, RANK: ${rank}`);
    };

    const renderSquare = (file: number, rank: number, color: string, piece?: PieceProps) => {
        return <Square 
            key={`${file}${rank}`} 
            file={file} 
            rank={rank} 
            color={color} 
            piece={piece}
            onClick={onSquareClick}
            
        />; //'\u265C' for black knight
    }

    const renderSquares = () => {
        const rows = [];
        for (let i = 0; i < boardState.fileNum; i++) {
            const row = [];
            for (let j = 0; j < boardState.rankNum; j++) {
                let squareState: SquareState = boardState.getSquare(i, j);
                row.push(renderSquare(squareState.file, squareState.rank, squareState.color, squareState.piece));
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

