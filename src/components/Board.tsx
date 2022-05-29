import React from "react";
import './Board.css'
import { Square } from "./Square";

export class Board extends React.Component {
    renderSquare(file: number, rank: number, color: string) {
        return <Square file={file} rank={rank} color={color} /> //'\u265C' for black knight
    }

    renderRow(rank: number) {
        let colorIn: boolean = rank % 2 === 0;
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push(this.renderSquare(i, rank, colorIn ? '#519e47' : '#FFFDD0'));
            colorIn = !colorIn;
        }
        return (
            <div className="board-row">
                {row}
            </div>
        );
    }

    render() {
        const rows = [];
        for (let i = 0; i < 8; i++) {
            rows.unshift(this.renderRow(i));
        }

        return (
            <div>
                {rows}
            </div>
        );
    }   
}