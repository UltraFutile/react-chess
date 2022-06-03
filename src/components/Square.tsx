import './Square.css'
import { Bishop, King, Knight, Pawn, Queen, Rook } from './pieces/Pieces';
import { PieceProps } from '../lib/model/PieceProps';

type Props = {
    file: number
    rank: number 
    color: string
    piece?: PieceProps
    selected: boolean
    onClick: (file: number, rank: number) => void
}

const fileCharStr = "ABCDEFGH";

export const Square = (props: Props) => {
    const buttonStyle = {
        backgroundColor: props.selected ? "#0082AD" : props.color
    };
    
    return (
        <button className="square" style={buttonStyle} onClick={() => props.onClick(props.file, props.rank)} title={`${fileCharStr[props.file]}${props.rank + 1}`}>
            {getPieceComponent(props.piece)}
        </button>
    );
}

function getPieceComponent(piece?: PieceProps) {
    if (piece) {
        switch(piece.piece) {
            case "king":
                return <King team={piece.team}></King>;
            case "queen":
                return <Queen team={piece.team}></Queen>;
            case "bishop":
                return <Bishop team={piece.team}></Bishop>;
            case "knight":
                return <Knight team={piece.team}></Knight>;
            case "rook":
                return <Rook team={piece.team}></Rook>;
            case "pawn":
                return <Pawn team={piece.team}></Pawn>;
            default:
                throw new Error("piece does not exist");
        }
        
    }
}