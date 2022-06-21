import { addPiece } from "../../components/board/ManagePiece";
import { BoardState, BoardStateFactory, getDestination, getIndexesFromCoordinates } from "../model/BoardState";
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
        const origin = getIndexesFromCoordinates(['e', 4]);

        beforeEach(() => {
            addPiece(state, thisTeam, 'rook', origin);
        });

        it("can move to any square on the same file", () => {
            for (let i = 0; i < state.rankNum; i++) {
                if (i === 3)
                    continue;
                expect(isLegalRookMove(state, origin, [4, i])).toBe(true);
            }
        });
        it("can move to any square on the same rank", () => {
            for (let i = 0; i < state.fileNum; i++) {
                if (i === 4)
                    continue;
                expect(isLegalRookMove(state, origin, [i, 3])).toBe(true);
            }
        });
    });

    describe("movement with obstacles", () => {
        const origin = getIndexesFromCoordinates(['e', 4]);

        beforeEach(() => {
            addPiece(state, thisTeam, 'rook', origin);
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { rank: 1 }));
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { rank: -1 }));
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { file: 1 }));
            addPiece(state, otherTeam, 'pawn', getDestination(state, origin, { file: -1 }));
        });

        it("can't move when there are obstacles in it's path", () => {
            expect(isLegalRookMove(state, origin, getDestination(state, origin, { rank: 2 }))).toBe(false);
            expect(isLegalRookMove(state, origin, getDestination(state, origin, { rank: -2 }))).toBe(false);
            expect(isLegalRookMove(state, origin, getDestination(state, origin, { file: 2 }))).toBe(false);
            expect(isLegalRookMove(state, origin, getDestination(state, origin, { file: -2 }))).toBe(false);
        });
    });
});