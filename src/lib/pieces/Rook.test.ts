import { addPiece } from "../../components/board/ManagePiece";
import { Coordinates } from "../../types/AlgebraicNotation";
import { BoardState, BoardStateFactory, getCoordinatesFromIndexes, getDestination } from "../model/BoardState";
import { Team } from "../Team";
import { isLegalRookMove } from "./Rook";

describe.each([
    { thisTeam: Team.White, otherTeam: Team.Black},
    { thisTeam: Team.Black, otherTeam: Team.White}
])("rook tests", ({ thisTeam, otherTeam }) => {
    const boardFactory: BoardStateFactory = new BoardStateFactory();
    let state: BoardState;

    beforeEach(() => {
        state = boardFactory.createBoardState();
    });

    describe("legal move range", () => {
        const origin: Coordinates = ['e', 4];

        beforeEach(() => {
            addPiece(state, thisTeam, 'rook', origin);
        });

        it("can move to any square on the same file", () => {
            for (let i = 0; i < state.rankNum; i++) {
                if (i === 3)
                    continue;
                expect(isLegalRookMove(state, origin, getCoordinatesFromIndexes(4, i))).toBe(true);
            }
        });
        it("can move to any square on the same rank", () => {
            for (let i = 0; i < state.fileNum; i++) {
                if (i === 4)
                    continue;
                expect(isLegalRookMove(state, origin, getCoordinatesFromIndexes(i, 3))).toBe(true);
            }
        });
    });
});