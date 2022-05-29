import React from "react";
import './Board.css'
import { Square } from "./Square";

export class Board extends React.Component {
    renderSquare() {
        return <Square />
    }

    renderRow() {
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push(this.renderSquare());
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
            rows.push(this.renderRow());
        }

        return (
            <div>
                {rows}
            </div>
        );
    }   
}