import { BoardFile, BoardRank, Coordinates } from "../../types/AlgebraicNotation";
import { Team } from "../Team";
import { SquareState } from "./SquareState";

export interface BoardState {
    fileNum: number;
    rankNum: number;
    squareGrid: SquareState[][];
    currentlySelectedSquare?: SquareState;
}

const fileToIndexMap: Record<BoardFile, number> = {
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7
}
const indexToFileMap: Record<number, BoardFile> = {
    0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h'
}

const fileToIndex = (file: BoardFile): number => fileToIndexMap[file];
const indexToFile = (index: number): BoardFile => indexToFileMap[index];
const rankToIndex = (rank: BoardRank): number => rank - 1;
const indexToRank = (index: number): BoardRank => index + 1 as BoardRank;


export function getMovement(orig: Coordinates, dest: Coordinates) : [number, number] {
    return [
        fileToIndex(dest[0]) - fileToIndex(orig[0]), 
        rankToIndex(dest[1]) - rankToIndex(orig[1])
    ];
}

export function getDestination(
    boardState: BoardState, 
    orig: Coordinates, 
    delta: {file?: number, rank?: number}): Coordinates {
    let file: BoardFile;
    if (delta.file) {
        let fileIndex: number = fileToIndex(orig[0]) + delta.file;
        if (fileIndex < 0 || fileIndex >= boardState.fileNum)
            throw new Error(`Invald destination file ${fileIndex}`);
        file = indexToFile(fileIndex);
    }
    else {
        file = orig[0];
    }

    let rank: BoardRank;
    if (delta.rank) {
        let rankIndex: number = rankToIndex(orig[1]) + delta.rank;
        if (rankIndex < 0 || rankIndex >= boardState.rankNum)
            throw new Error(`Invald destination rank ${rankIndex}`);    
        rank = indexToRank(rankIndex);
    }
    else {
        rank = orig[1];
    }
    
    return [file, rank];
}

export function getSquare(boardState: BoardState, coordinates: Coordinates): SquareState {
    return boardState.squareGrid[fileToIndexMap[coordinates[0]]][rankToIndex(coordinates[1])];
}

export function getCoordinates(square: SquareState): Coordinates {
    return [indexToFile(square.file), indexToRank(square.rank)];
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

    setBoardPieces(squareArray: SquareState[][]) {
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
