import { BoardFile, BoardRank, Coordinates } from "../../types/AlgebraicNotation";
import { Team } from "../Team";
import { Piece } from "./PieceProps";
import { SquareState } from "./SquareState";

export interface BoardState {
    fileNum: number;
    rankNum: number;
    squareGrid: SquareState[][];
    currentlySelectedSquare?: SquareState;
    whichTeamsTurn: Team;
    whitePieceMap: Record<Piece, Set<SquareState>>;
    blackPieceMap: Record<Piece, Set<SquareState>>;
}

const fileToIndexMap: Record<BoardFile, number> = {
    'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7
}

const fileToIndex = (file: BoardFile): number => fileToIndexMap[file];
const rankToIndex = (rank: BoardRank): number => rank - 1;

export function getSquare(state: BoardState, [file, rank]: [number, number]) {
    return state.squareGrid[file][rank]
}

export function getMoveDiff(
    [originFileIndex, originRankIndex]: [number, number], 
    [destFileIndex, destRankIndex]: [number, number]) 
    : [number, number] {
    return [
        destFileIndex - originFileIndex, 
        destRankIndex - originRankIndex
    ];
}

export function getDestination(
    boardState: BoardState, 
    [origFile, origRank]: [number, number], 
    delta: {file?: number, rank?: number}): [number, number] {
    let file: number;
    if (delta.file) {
        let fileIndex: number = origFile + delta.file;
        if (fileIndex < 0 || fileIndex >= boardState.fileNum)
            throw new Error(`Invald destination file ${fileIndex}`);
        file = fileIndex;
    }
    else {
        file = origFile;
    }

    let rank: number;
    if (delta.rank) {
        let rankIndex: number = origRank + delta.rank;
        if (rankIndex < 0 || rankIndex >= boardState.rankNum)
            throw new Error(`Invald destination rank ${rankIndex}`);    
        rank = rankIndex;
    }
    else {
        rank = origRank;
    }
    
    return [file, rank];
}
export function getIndexesFromCoordinates(coordinates: Coordinates): [number, number] {
    return [fileToIndex(coordinates[0]), rankToIndex(coordinates[1])];
}

export class BoardStateFactory {
    createBoardState(fileNum: number = 8, rankNum: number = 8): BoardState {
        let squareGrid = this.createSquareGrid(fileNum, rankNum);
        return {
            fileNum,
            rankNum,
            squareGrid,
            whichTeamsTurn: Team.White,
            whitePieceMap: {
                king: new Set<SquareState>(),
                queen: new Set<SquareState>(),
                bishop: new Set<SquareState>(),
                knight:new Set<SquareState>(),
                pawn: new Set<SquareState>(),
                rook: new Set<SquareState>(),
            },
            blackPieceMap: {
                king: new Set<SquareState>(),
                queen: new Set<SquareState>(),
                bishop: new Set<SquareState>(),
                knight:new Set<SquareState>(),
                pawn: new Set<SquareState>(),
                rook: new Set<SquareState>(),
            }
        }
    }

    private createSquareGrid(fileNum: number, rankNum: number): SquareState[][] {
        let squareArray: SquareState[][];
        squareArray = this.initializeSquares(fileNum, rankNum);
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

    setBoardPieces(boardState: BoardState) {
        const squareArray: SquareState[][] = boardState.squareGrid;

        const setPiece = (square: SquareState, team: Team, piece: Piece) => {
            square.piece = { team, piece };
            if (team === Team.White) {
                boardState.whitePieceMap[piece].add(square);
            }
            else {
                boardState.blackPieceMap[piece].add(square);
            }
        }

        // White pieces
        setPiece(squareArray[0][0], Team.White, 'rook');
        setPiece(squareArray[1][0], Team.White, 'knight');
        setPiece(squareArray[2][0], Team.White, 'bishop');
        setPiece(squareArray[3][0], Team.White, 'queen');
        setPiece(squareArray[4][0], Team.White, 'king');
        setPiece(squareArray[5][0], Team.White, 'bishop');
        setPiece(squareArray[6][0], Team.White, 'knight');
        setPiece(squareArray[7][0], Team.White, 'rook');

        for (let i = 0; i < 8; i++) {
            setPiece(squareArray[i][1], Team.White, 'pawn');
        }

        // Black pieces

        setPiece(squareArray[0][7], Team.Black, 'rook');
        setPiece(squareArray[1][7], Team.Black, 'knight');
        setPiece(squareArray[2][7], Team.Black, 'bishop');
        setPiece(squareArray[3][7], Team.Black, 'queen');
        setPiece(squareArray[4][7], Team.Black, 'king');
        setPiece(squareArray[5][7], Team.Black, 'bishop');
        setPiece(squareArray[6][7], Team.Black, 'knight');
        setPiece(squareArray[7][7], Team.Black, 'rook');

        for (let i = 0; i < 8; i++) {
            setPiece(squareArray[i][6], Team.Black, 'pawn');
        }
    }    
}
