import { Team } from "../Team";
import { SquareState } from "./SquareState";

export interface BoardState {
    fileNum: number;
    rankNum: number;
    squareGrid: SquareState[][];
    selectedSquare?: [number, number];
}

export class BoardStateFactory {
    createBoardState(fileNum: number = 8, rankNum: number = 8): BoardState {
        let squareGrid = this.createSquareGrid(fileNum, rankNum);
        return {
            fileNum,
            rankNum,
            squareGrid
        }
    }

    private createSquareGrid(fileNum: number, rankNum: number): SquareState[][] {
        let squareArray: SquareState[][];
        squareArray = this.initializeSquares(fileNum, rankNum);
        this.setBoardPieces(squareArray);
        return squareArray;
    }

    private initializeSquares(fileNum: number, rankNum: number) {
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
                    rank: j,
                    selected: false
                });
                colorIn = !colorIn;
            }
            rows.push(row);
        }
    
        return rows;
    }
    private setBoardPieces(squareArray: SquareState[][]) {
        // White pieces
        squareArray[0][0].piece = {
            team: Team.White,
            piece: 'rook'
        }

        squareArray[0][1].piece = {
            team: Team.White,
            piece: 'knight'
        }

        squareArray[0][2].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        squareArray[0][3].piece = {
            team: Team.White,
            piece: 'queen'
        }

        squareArray[0][4].piece = {
            team: Team.White,
            piece: 'king'
        }

        squareArray[0][5].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        squareArray[0][6].piece = {
            team: Team.White,
            piece: 'knight'
        }

        squareArray[0][7].piece = {
            team: Team.White,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            squareArray[1][i].piece = {
                team: Team.White,
                piece: 'pawn'
            }
        }

        // Black pieces
        squareArray[7][0].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        squareArray[7][1].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        squareArray[7][2].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        squareArray[7][3].piece = {
            team: Team.Black,
            piece: 'queen'
        }

        squareArray[7][4].piece = {
            team: Team.Black,
            piece: 'king'
        }

        squareArray[7][5].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        squareArray[7][6].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        squareArray[7][7].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            squareArray[6][i].piece = {
                team: Team.Black,
                piece: 'pawn'
            }
        }
    }
}
