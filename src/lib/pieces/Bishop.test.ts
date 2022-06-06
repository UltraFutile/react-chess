import { addPiece } from "../../components/board/ManagePiece";
import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardStateFactory, BoardState, getCoordinatesFromIndexes, getIndexesFromCoordinates } from "../model/BoardState";
import { Team } from "../Team";
import { isLegalBishopMove } from "./Bishop";

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("bishop tests", ({thisTeam, otherTeam}) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("legal move range", () => {
        const origin: Coordinates = ['e', 4];

        beforeEach(() => {
            addPiece(state, thisTeam, 'bishop', origin);
        });

        it("can move to any square diagonally in the north east direction", () => {
            const [origFileIndex, origRankIndex] = getIndexesFromCoordinates(origin);
            const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(['h', 7]);

            for (let fileIndex = origFileIndex + 1, rankIndex = origRankIndex + 1; 
                fileIndex <= destFileIndex && rankIndex <= destRankIndex; fileIndex++, rankIndex++) {
                expect(isLegalBishopMove(state, origin, getCoordinatesFromIndexes(fileIndex, rankIndex))).toBe(true);
            }
        });

        it("can move to any square diagonally in the south east direction", () => {
            const [origFileIndex, origRankIndex] = getIndexesFromCoordinates(origin);
            const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(['h', 1]);

            for (let fileIndex = origFileIndex + 1, rankIndex = origRankIndex - 1; 
                fileIndex <= destFileIndex && rankIndex >= destRankIndex; fileIndex++, rankIndex--) {
                expect(isLegalBishopMove(state, origin, getCoordinatesFromIndexes(fileIndex, rankIndex))).toBe(true);
            }
        });

        it("can move to any square diagonally in the north west direction", () => {
            const [origFileIndex, origRankIndex] = getIndexesFromCoordinates(origin);
            const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(['a', 8]);

            for (let fileIndex = origFileIndex - 1, rankIndex = origRankIndex + 1; 
                fileIndex >= destFileIndex && rankIndex <= destRankIndex; fileIndex--, rankIndex++) {
                expect(isLegalBishopMove(state, origin, getCoordinatesFromIndexes(fileIndex, rankIndex))).toBe(true);
            }
        });

        it("can move to any square diagonally in the south west direction", () => {
            const [origFileIndex, origRankIndex] = getIndexesFromCoordinates(origin);
            const [destFileIndex, destRankIndex] = getIndexesFromCoordinates(['h', 7]);

            for (let fileIndex = origFileIndex + 1, rankIndex = origRankIndex + 1; 
                fileIndex <= destFileIndex && rankIndex <= destRankIndex; fileIndex++, rankIndex++) {
                expect(isLegalBishopMove(state, origin, getCoordinatesFromIndexes(fileIndex, rankIndex))).toBe(true);
            }
        });
    });
});