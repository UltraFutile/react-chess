import { Team } from "../Team";
import { SquareState } from "./SquareState";

export class BoardState {
    private squareArray: SquareState[][];
    public fileNum: number;
    public rankNum: number;

    constructor(fileNum: number = 8, rankNum: number = 8) {
        this.fileNum = fileNum;
        this.rankNum = rankNum;
        this.squareArray = this.initializeSquares(fileNum, rankNum);
        this.setBoardPieces();
    }

    initializeSquares(fileNum: number, rankNum: number) {
        const squareDarkColor = '#9F5130'; // Bombay Brown
        const squareLightcolor = '#F9CCB7'; // Biscuit Cream
        const rows = [];
        for (let i = 0; i < fileNum; i++) {
            let row: SquareState[] = [];
            let colorIn: boolean = i % 2 === 0;
            for (let j = 0; j < rankNum; j++) {
                row.push({
                    color:  colorIn ? squareDarkColor : squareLightcolor,
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

    setBoardPieces() {
        // White pieces
        this.squareArray[0][0].piece = {
            team: Team.White,
            piece: 'rook'
        }

        this.squareArray[0][1].piece = {
            team: Team.White,
            piece: 'knight'
        }

        this.squareArray[0][2].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        this.squareArray[0][3].piece = {
            team: Team.White,
            piece: 'queen'
        }

        this.squareArray[0][4].piece = {
            team: Team.White,
            piece: 'king'
        }

        this.squareArray[0][5].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        this.squareArray[0][6].piece = {
            team: Team.White,
            piece: 'knight'
        }

        this.squareArray[0][7].piece = {
            team: Team.White,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            this.squareArray[1][i].piece = {
                team: Team.White,
                piece: 'pawn'
            }
        }

        // Black pieces
        this.squareArray[7][0].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        this.squareArray[7][1].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        this.squareArray[7][2].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        this.squareArray[7][3].piece = {
            team: Team.Black,
            piece: 'queen'
        }

        this.squareArray[7][4].piece = {
            team: Team.Black,
            piece: 'king'
        }

        this.squareArray[7][5].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        this.squareArray[7][6].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        this.squareArray[7][7].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            this.squareArray[6][i].piece = {
                team: Team.Black,
                piece: 'pawn'
            }
        }
    }
}
