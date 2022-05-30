import React from 'react';
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
        console.log(`FILE: ${file}, RANK: ${rank}`)
    };

    const renderSquare = (file: number, rank: number, color: string) => {
        return <Square 
            key={`${file}${rank}`} 
            file={file} 
            rank={rank} 
            color={color} 
            onClick={onSquareClick}
            
        />; //'\u265C' for black knight
    }

    const renderSquares = () => {
        const rows = [];
        for (let i = 0; i < boardState.fileNum; i++) {
            const row = [];
            for (let j = 0; j < boardState.rankNum; j++) {
                let squareState: SquareState = boardState.getSquare(i, j);
                row.push(renderSquare(squareState.file, squareState.rank, squareState.color));
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

interface SquareState {
    color: string;
    file: number;
    rank: number;
}

class BoardState {
    private squareArray: SquareState[][];
    public fileNum: number;
    public rankNum: number;

    constructor(fileNum: number = 8, rankNum: number = 8) {
        this.squareArray = this.initializeSquares(fileNum, rankNum);
        this.fileNum = fileNum;
        this.rankNum = rankNum;
    }

    initializeSquares(fileNum: number, rankNum: number) {
        const rows = [];
        for (let i = 0; i < fileNum; i++) {
            let row: SquareState[] = [];
            let colorIn: boolean = i % 2 === 0;
            for (let j = 0; j < rankNum; j++) {
                row.push({
                    color:  colorIn ? '#BA8C63' : '#FFFAF0',
                    file: i,
                    rank: j
                });
                colorIn = !colorIn;
            }
            rows.push(row);
        }
    
        return rows;
    }

    getSquare(file: number, rank: number) {
        return this.squareArray[file][rank];
    }
}