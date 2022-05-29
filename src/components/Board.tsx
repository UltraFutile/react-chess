import React from "react";
import './Board.css'
import { Square } from "./Square";

export class Board extends React.Component {
    renderSquare(file: number, rank: number) {
        return <Square file={file} rank={rank} /> //'\u265C' for black knight
    }

    renderRow(rank: number) {
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push(this.renderSquare(i, rank));
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