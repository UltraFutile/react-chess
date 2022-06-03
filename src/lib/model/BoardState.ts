import { Team } from "../Team";
import { SquareState } from "./SquareState";

export interface BoardState {
    fileNum: number;
    rankNum: number;
    squareGrid: SquareState[][];
    currentlySelectedSquare?: SquareState;
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

        squareArray[1][0].piece = {
            team: Team.White,
            piece: 'knight'
        }

        squareArray[2][0].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        squareArray[3][0].piece = {
            team: Team.White,
            piece: 'queen'
        }

        squareArray[4][0].piece = {
            team: Team.White,
            piece: 'king'
        }

        squareArray[5][0].piece = {
            team: Team.White,
            piece: 'bishop'
        }

        squareArray[6][0].piece = {
            team: Team.White,
            piece: 'knight'
        }

        squareArray[7][0].piece = {
            team: Team.White,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            squareArray[i][1].piece = {
                team: Team.White,
                piece: 'pawn'
            }
        }

        // Black pieces
        squareArray[0][7].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        squareArray[1][7].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        squareArray[2][7].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        squareArray[3][7].piece = {
            team: Team.Black,
            piece: 'queen'
        }

        squareArray[4][7].piece = {
            team: Team.Black,
            piece: 'king'
        }

        squareArray[5][7].piece = {
            team: Team.Black,
            piece: 'bishop'
        }

        squareArray[6][7].piece = {
            team: Team.Black,
            piece: 'knight'
        }

        squareArray[7][7].piece = {
            team: Team.Black,
            piece: 'rook'
        }

        for (let i = 0; i < 8; i++) {
            squareArray[i][6].piece = {
                team: Team.Black,
                piece: 'pawn'
            }
        }
    }
}
