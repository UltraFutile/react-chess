import './Board.css'
import { Square } from "./Square";

export const Board = () => {
    const renderSquare = (file: number, rank: number, color: string) => {
        return <Square file={file} rank={rank} color={color} /> //'\u265C' for black knight
    }

    const renderRow = (rank: number) => {
        let colorIn: boolean = rank % 2 === 0;
        const row = [];
        for (let i = 0; i < 8; i++) {
            row.push(renderSquare(i, rank, colorIn ? '#BA8C63' : '#FFFDD0'));
            colorIn = !colorIn;
        }
        return (
            <div className="board-row">
                {row}
            </div>
        );
    }

    const rows = [];
    for (let i = 0; i < 8; i++) {
        rows.unshift(renderRow(i));
    }

    return (
        <div>
            {rows}
        </div>
    );
}