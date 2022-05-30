import { SquareState } from "./SquareState";

export class BoardState {
    private squareArray: SquareState[][];
    public fileNum: number;
    public rankNum: number;

    constructor(fileNum: number = 8, rankNum: number = 8) {
        this.squareArray = this.initializeSquares(fileNum, rankNum);
        this.fileNum = fileNum;
        this.rankNum = rankNum;
    }

    initializeSquares(fileNum: number, rankNum: number) {
        const chestNutColor = '#954535';
        const antiqueWhiteColor = '#FAEBD7';
        const rows = [];
        for (let i = 0; i < fileNum; i++) {
            let row: SquareState[] = [];
            let colorIn: boolean = i % 2 === 0;
            for (let j = 0; j < rankNum; j++) {
                row.push({
                    color:  colorIn ? chestNutColor : antiqueWhiteColor,
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
}
